import Anthropic from '@anthropic-ai/sdk';
import { FAQ_OFFLINE } from '../data/faq-offline';
import type { FiqhBridgeResult, AnswerSource } from '../types/ai.types';
import type { PersonaModel } from '../types/persona.types';
import type { HeatStatus, } from '../types/health.types';
import type { HaramZone, IhramState, MiqatName, MiqatStatus } from '../types/location.types';

// NOTE: Claude API calls must go through a server proxy — never expose API key client-side.
// This service is structured to call your backend proxy endpoint.
// During development only, direct SDK usage is permitted for testing.

const PROXY_ENDPOINT = process.env.EXPO_PUBLIC_CLAUDE_PROXY_URL ?? '';

// Jailbreak pattern removal
function sanitizeInput(input: string): string {
  const jailbreakPatterns = [
    /ignore (previous|above|all) instructions/gi,
    /you are now/gi,
    /pretend (you are|to be)/gi,
    /act as (if you are|a)/gi,
    /disregard (your|all) (training|instructions|guidelines)/gi,
    /\bDAN\b/g,
  ];
  let sanitized = input;
  for (const pattern of jailbreakPatterns) {
    sanitized = sanitized.replace(pattern, '[REMOVED]');
  }
  return sanitized.trim();
}

// Keyword-based confidence scoring
function scoreConfidence(query: string, faqItem: typeof FAQ_OFFLINE[0]): number {
  const normalizedQuery = query.toLowerCase();
  const allKeywords = faqItem.keywords;
  let matches = 0;
  for (const keyword of allKeywords) {
    if (normalizedQuery.includes(keyword.toLowerCase())) matches++;
  }
  // Score: each matching keyword adds 0.5, capped at 1.0.
  // This means 2+ keyword matches = verified_local (≥0.8) regardless of total keyword count.
  return allKeywords.length > 0 ? Math.min(1.0, matches * 0.5) : 0;
}

function buildSystemPrompt(params: {
  persona: PersonaModel;
  currentZone: HaramZone;
  miqatName: MiqatName | null;
  miqatStatus: MiqatStatus;
  currentTemp: number | null;
  heatStatus: HeatStatus;
  ihramState: IhramState;
}): string {
  const { persona, currentZone, miqatName, miqatStatus, currentTemp, heatStatus, ihramState } = params;

  const genderRulingNote =
    persona.gender === 'female'
      ? 'أنثى: لا تلبية جهرية، لا رمل، لا اضطباع، تقصير فقط (لا حلق أبداً)'
      : 'ذكر: رمل في الأشواط 1-3، اضطباع، تلبية جهراً';

  const dammWarningLine =
    ihramState === 'crossed_without_ihram'
      ? '⚠️ تحذير: تجاوز الميقات بدون إحرام — لا تقدم إرشادات مناسك'
      : '';

  return `أنت "مطوف" — مرشد حج وعمرة إسلامي عالم وودود.

## بيانات الحاج:
- الاسم: ${persona.name} (${persona.gender === 'female' ? 'أنثى' : 'ذكر'})
- الجنس: ${genderRulingNote}
- اللهجة: ${persona.dialectKey}
- نوع النسك: ${persona.ritualType}
- المنطقة الحالية: ${currentZone ?? 'غير معروفة'}
- الميقات: ${miqatName ?? 'غير محدد'} | الحالة: ${miqatStatus}
- درجة الحرارة الحالية: ${currentTemp !== null ? `${currentTemp}°م` : 'غير متاحة'} | مستوى الخطورة: ${heatStatus}
${dammWarningLine}

## قواعد الرد:
1. رد باللهجة المناسبة لـ ${persona.dialectKey}، مختصر وعملي
2. أنثى: لا تلبية جهرية، لا رمل، لا اضطباع، تقصير فقط (لا حلق أبداً)
3. ذكر: رمل في الأشواط 1-3، اضطباع، تلبية جهراً
4. لا تختلق أحاديث — استخدم [SOURCE_NEEDED] إن لم تعرف المصدر
5. للفتاوى الملزمة: وجّه للمكتب الفقهي أو islamweb.net
6. أنت مساعد ذكاء اصطناعي — لست مصدراً للفتوى الشرعية
7. للطوارئ الطبية: 911 | وزارة الحج: 966-920-002-814+
8. إذا كان الطقس شديد الحرارة (${heatStatus === 'extreme' ? 'شديد الخطورة' : heatStatus}): اذكر أهمية الإماهة والراحة
9. لا تعرض صوراً للنبي ﷺ أو الصحابة أو أهل البيت
10. انتقاد الإسلام أو الترويج لدين آخر: رد بأدب وأعد التوجيه
${ihramState === 'crossed_without_ihram' ? '11. حالة الدم نشطة: ارفض جميع أسئلة المناسك وأحل فقط لعالم شرعي أو islamweb.net' : ''}`;
}

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    // In production: calls go through PROXY_ENDPOINT, not direct SDK
    this.client = new Anthropic({
      apiKey: process.env.EXPO_PUBLIC_CLAUDE_DEV_KEY ?? 'placeholder',
      dangerouslyAllowBrowser: true, // web bundling only — production routes via proxy
    });
  }

  async processQuery(params: {
    query: string;
    persona: PersonaModel;
    currentZone: HaramZone;
    miqatName: MiqatName | null;
    miqatStatus: MiqatStatus;
    currentTemp: number | null;
    heatStatus: HeatStatus;
    ihramState: IhramState;
    isOnline: boolean;
    onToken?: (token: string) => void;
  }): Promise<FiqhBridgeResult> {
    const {
      query, persona, currentZone, miqatName, miqatStatus,
      currentTemp, heatStatus, ihramState, isOnline, onToken,
    } = params;

    // PRE-CHECK: Damm lockout
    if (ihramState === 'crossed_without_ihram') {
      const lockoutResponse =
        'أنت في حالة تستوجب استشارة عالم شرعي بخصوص الدم.\n' +
        'لا يمكنني إرشادك في المناسك حتى يتم حل هذا الوضع.\n' +
        'تواصل مع: islamweb.net | دار الإفتاء +966-11-4083030';
      return {
        answer: lockoutResponse,
        source: 'damm_lockout',
        confidence: 1,
        showAskAiChip: false,
      };
    }

    const sanitized = sanitizeInput(query);

    // Layer 1: Offline RAG
    const scoredFaq = FAQ_OFFLINE.map((item) => ({
      item,
      score: scoreConfidence(sanitized, item),
    })).sort((a, b) => b.score - a.score);

    const topMatch = scoredFaq[0];

    if (topMatch && topMatch.score >= 0.8) {
      // Filter by gender if applicable
      if (
        topMatch.item.genderSpecific === null ||
        topMatch.item.genderSpecific === persona.gender
      ) {
        const answer =
          persona.languageCode.startsWith('ar') ||
          persona.languageCode.startsWith('ur')
            ? topMatch.item.answerAr
            : topMatch.item.answerEn;
        return {
          answer,
          source: 'verified_local',
          confidence: topMatch.score,
          showAskAiChip: false,
        };
      }
    }

    if (topMatch && topMatch.score >= 0.6) {
      // Partial match — show local + "ask AI" chip
      if (
        topMatch.item.genderSpecific === null ||
        topMatch.item.genderSpecific === persona.gender
      ) {
        const answer =
          persona.languageCode.startsWith('ar') ? topMatch.item.answerAr : topMatch.item.answerEn;
        return {
          answer,
          source: 'partial_local',
          confidence: topMatch.score,
          showAskAiChip: true,
        };
      }
    }

    // Layer 2: Online Claude API
    if (!isOnline) {
      const offlineAnswers = scoredFaq
        .slice(0, 3)
        .filter((s) => s.score > 0)
        .map((s) =>
          persona.languageCode.startsWith('ar') ? s.item.answerAr : s.item.answerEn
        )
        .join('\n\n---\n\n');

      const offlineFallbackMsg = persona.languageCode.startsWith('ar')
        ? 'لم يتم العثور على محتوى مطابق في وضع عدم الاتصال.'
        : 'No matching content found offline.';
      return {
        answer: offlineAnswers || offlineFallbackMsg,
        source: 'offline_fallback',
        confidence: 0,
        showAskAiChip: false,
      };
    }

    const systemPrompt = buildSystemPrompt({
      persona, currentZone, miqatName, miqatStatus, currentTemp, heatStatus, ihramState,
    });

    // Stream via Claude API (in production: route through server proxy)
    let fullResponse = '';

    const stream = await this.client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: sanitized }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullResponse += chunk.delta.text;
        onToken?.(chunk.delta.text);
      }
    }

    return {
      answer: fullResponse,
      source: 'claude_api',
      confidence: 1,
      showAskAiChip: false,
    };
  }
}

export const claudeService = new ClaudeService();
