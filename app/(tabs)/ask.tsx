import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { useHealthStore } from '../../src/stores/healthStore';
import { Colors } from '../../src/theme/colors';
import { claudeService } from '../../src/services/claudeService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  source?: string;
}

const SOURCE_LABELS: Record<string, string> = {
  verified_local: '✅ Verified source',
  partial_local: '⚠️ Partial match',
  claude_api: '🤖 AI response',
  offline_fallback: '📖 Offline guidance',
  damm_lockout: '🔒 Locked',
};

const SUGGESTION_KEYS = ['suggestion_raml', 'suggestion_shave', 'suggestion_idtiba', 'suggestion_talbiyah'] as const;

export default function AskScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const currentZone = useLocationStore((s) => s.currentZone);
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);
  const miqatStatus = useLocationStore((s) => s.miqatStatus);
  const ihramState = useLocationStore((s) => s.ihramState);
  const heatStatus = useHealthStore((s) => s.heatStatus);
  const currentTemp = useHealthStore((s) => s.currentTempCelsius);
  const scrollRef = useRef<ScrollView>(null);
  const isAr = i18n.language.startsWith('ar');

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (ihramState === 'crossed_without_ihram') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.locked}>
          <Text style={styles.lockedTitle}>{t('ask.damm_locked_title')}</Text>
          <Text style={styles.lockedBody}>{t('ask.damm_locked_body')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const effectivePersona = persona ?? {
    name: '',
    gender: 'male' as const,
    ritualType: 'umrah' as const,
    languageCode: i18n.language,
    dialectKey: 'standard_arabic' as const,
    nationalityCode: '',
    mobilityLevel: 'standard' as const,
    emergencyContactName: '',
    emergencyContactPhone: '',
    hotelMakkahName: '',
    hotelMakkahAddress: '',
    hotelMadinahName: '',
    hotelMadinahAddress: '',
    groupGuideName: '',
    groupGuidePhone: '',
  };

  const handleSend = async (query?: string) => {
    const q = (query ?? input).trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const result = await claudeService.processQuery({
        query: q,
        persona: effectivePersona,
        currentZone,
        miqatName: miqatAssignment,
        miqatStatus,
        currentTemp,
        heatStatus,
        ihramState,
        isOnline: false, // offline-first — no proxy configured yet
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: result.answer,
          source: result.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', text: t('common.error') },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>💬 {t('tabs.ask')}</Text>
          <Text style={styles.disclaimer}>{t('ask.disclaimer')}</Text>
        </View>

        {!persona && (
          <TouchableOpacity style={styles.profileBanner} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.profileBannerText}>👤 {t('ask.profile_tip')}</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🤔</Text>
              <Text style={styles.emptyTitle}>{t('ask.empty_title')}</Text>
              <Text style={styles.emptySubtitle}>{t('ask.empty_subtitle')}</Text>
              <View style={styles.suggestions}>
                {SUGGESTION_KEYS.map((key) => {
                  const q = t(`ask.${key}`);
                  return (
                    <TouchableOpacity key={key} style={styles.suggestion} onPress={() => handleSend(q)}>
                      <Text style={styles.suggestionText}>{q}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {messages.map((msg) => (
            <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.bubbleTextUser]}>
                {msg.text}
              </Text>
              {msg.role === 'assistant' && msg.source && SOURCE_LABELS[msg.source] && (
                <Text style={styles.sourceLabel}>{SOURCE_LABELS[msg.source]}</Text>
              )}
            </View>
          ))}

          {loading && (
            <View style={[styles.bubble, styles.bubbleAssistant]}>
              <ActivityIndicator size="small" color={Colors.brandGreen} />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={t('ask.placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendBtnText}>{t('common.send')}</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '18' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.brandGreen, marginBottom: 4 },
  disclaimer: { fontSize: 11, color: Colors.textPrimary, opacity: 0.4, lineHeight: 15 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  emptyState: { alignItems: 'center', paddingTop: 24 },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: Colors.textPrimary, opacity: 0.5, textAlign: 'center', marginBottom: 20 },
  suggestions: { gap: 8, width: '100%' },
  suggestion: {
    backgroundColor: Colors.white, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  suggestionText: { fontSize: 14, color: Colors.brandGreen },
  bubble: { maxWidth: '82%', borderRadius: 16, padding: 12, marginBottom: 10 },
  bubbleUser: {
    alignSelf: 'flex-end', backgroundColor: Colors.brandGreen, borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start', backgroundColor: Colors.white,
    borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  bubbleText: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white },
  sourceLabel: { fontSize: 10, color: Colors.brandGreen, opacity: 0.45, marginTop: 6 },
  inputBar: {
    flexDirection: 'row', padding: 12, gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.brandGreen + '18',
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1, backgroundColor: Colors.parchmentBg, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
    color: Colors.textPrimary, maxHeight: 100,
    borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  sendBtn: {
    backgroundColor: Colors.brandGreen, borderRadius: 12,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.brandGreen + '55' },
  sendBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  profileBanner: {
    backgroundColor: Colors.goldAccent + '18', borderBottomWidth: 1,
    borderBottomColor: Colors.goldAccent + '33', paddingHorizontal: 16, paddingVertical: 10,
  },
  profileBannerText: { fontSize: 12, color: Colors.goldAccent, fontWeight: '600' },
  locked: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  lockedTitle: { fontSize: 20, fontWeight: '700', color: Colors.danger, textAlign: 'center', marginBottom: 12 },
  lockedBody: { fontSize: 15, color: Colors.textPrimary, opacity: 0.7, textAlign: 'center', lineHeight: 24 },
});
