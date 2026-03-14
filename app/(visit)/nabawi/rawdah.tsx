import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../src/theme/colors';

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

// ─── Static section data (human-authored, sourced) ───────────────────────────

interface RawdahSection {
  id: string;
  emoji: string;
  titleAr: string;
  titleEn: string;
  points: { ar: string; en: string; source?: string }[];
}

const SECTIONS: RawdahSection[] = [
  {
    id: 'virtue',
    emoji: '🌿',
    titleAr: 'الفضل والمكانة',
    titleEn: 'Virtue & Status',
    points: [
      {
        ar: '«ما بين بيتي ومنبري روضة من رياض الجنة، ومنبري على حوضي»',
        en: '"Between my house and my minbar is a garden from the gardens of Paradise, and my minbar is upon my Cistern."',
        source: 'رواه البخاري عن أبي هريرة — Sahih Al-Bukhari 1196',
      },
      {
        ar: 'الروضة الشريفة: المساحة الممتدة بين الحجرة النبوية الشريفة ومنبره ﷺ',
        en: 'The Rawdah: the area between the Prophetic Chamber and his minbar ﷺ',
      },
      {
        ar: 'الصلاة في أي مكان من المسجد النبوي تعدل ألف صلاة في غيره',
        en: 'Prayer in Masjid Al-Nabawi equals 1,000 prayers in other mosques',
        source: 'Sahih Al-Bukhari 1190',
      },
    ],
  },
  {
    id: 'before',
    emoji: '🚿',
    titleAr: 'قبل الدخول',
    titleEn: 'Before Entering',
    points: [
      {
        ar: 'الطهارة الكاملة — وضوء تام',
        en: 'Complete purity — full wudu',
      },
      {
        ar: 'التطيب بالعطر لمن ليس في إحرام — سنة',
        en: 'Perfume for those not in Ihram — Sunnah',
      },
      {
        ar: 'احضر بقلب هادئ حاضر — هذا من أقدس البقاع على وجه الأرض',
        en: 'Bring a calm, present heart — this is among the most sacred spots on earth',
      },
      {
        ar: 'اعلم: قد لا تصل إلى الروضة ذاتها — الأجر كاملٌ في أي بقعة من المسجد',
        en: 'Know: you may not reach the Rawdah itself — full reward in any part of the Masjid',
      },
    ],
  },
  {
    id: 'inside',
    emoji: '🕌',
    titleAr: 'داخل الروضة',
    titleEn: 'Inside the Rawdah',
    points: [
      {
        ar: 'صلِّ تحية المسجد ركعتين إن لم تكن صليتهما بعد',
        en: 'Pray two rak\'ah tuhiyyat al-masjid if not yet performed',
      },
      {
        ar: 'صلِّ وادعُ كما شئت — لا دعاء مأثور بعينه مطلوب',
        en: 'Pray and supplicate as you wish — no specific fixed dua required',
      },
      {
        ar: 'الصمت المطلق والسكون الكامل — لا حديث اجتماعي',
        en: 'Absolute silence and stillness — no social conversation',
      },
      {
        ar: 'الهاتف: صامت تماماً — لا تصوير لأحد من المصلين',
        en: 'Phone: fully silent — no photography of other worshippers',
      },
    ],
  },
  {
    id: 'salam',
    emoji: '🤲',
    titleAr: 'تحية النبي ﷺ',
    titleEn: 'Greeting the Prophet ﷺ',
    points: [
      {
        ar: 'قل بصوت منخفض وحضور قلب:\nالسلام عليك يا رسول الله\nالسلام عليك يا نبي الله\nالسلام عليك يا خيرة الله من خلقه',
        en: 'Say with presence and low voice:\nAs-salamu \'alayka ya Rasulallah\nAs-salamu \'alayka ya Nabiyyallah\nAs-salamu \'alayka ya khiyaratan min khalqihi',
        source: 'ابن تيمية وجمهور العلماء — Ibn Taymiyyah and majority of scholars',
      },
      {
        ar: 'بعد السلام: استقبل القبلة — لا الحجرة — للدعاء الشخصي',
        en: 'After greeting: face the Qibla — not the chamber — for personal dua',
      },
      {
        ar: 'لا تمسح الشبك أو تضغط عليه — تحرك بعد السلام مباشرة',
        en: 'Do not wipe or press against the grille — move on promptly after greeting',
      },
      {
        ar: 'الدعاء يُوجَّه لله وحده — لا يُطلب من النبي ﷺ مباشرة',
        en: 'Direct dua to Allah alone — do not direct dua to the Prophet ﷺ',
      },
    ],
  },
  {
    id: 'prohibitions',
    emoji: '🚫',
    titleAr: 'المحظورات',
    titleEn: 'Prohibitions',
    points: [
      {
        ar: 'رفع الصوت — مهما كان السبب',
        en: 'Raising the voice — for any reason',
        source: 'Quran 49:2 — لا ترفعوا أصواتكم فوق صوت النبي',
      },
      {
        ar: 'التصوير والتسجيل للمصلين — انتهاك خصوصية العبادة',
        en: 'Photography or filming of worshippers — violates the sanctity of worship',
      },
      {
        ar: 'الدفع والتزاحم — لا ضرر ولا ضرار',
        en: 'Pushing and crowding — la darar wa la dirar',
        source: 'رواه ابن ماجة',
      },
      {
        ar: 'توجيه الدعاء للنبي ﷺ — الدعاء لله وحده',
        en: 'Directing dua to the Prophet ﷺ — dua is for Allah alone',
      },
      {
        ar: 'الوقوف أمام الحجرة لفترة طويلة — تعطيل القادمين',
        en: 'Standing in front of the chamber for long — blocking those behind you',
      },
    ],
  },
  {
    id: 'women',
    emoji: '👩',
    titleAr: 'للنساء',
    titleEn: 'For Women',
    points: [
      {
        ar: 'الدخول عبر البوابات ٢٥ و٢٩ (صحن المصلى الشرقي للنساء)',
        en: 'Entry via Gates 25 and 29 (eastern women\'s prayer hall)',
      },
      {
        ar: 'إن كان الازدحام شديداً: صلّي قريباً من الروضة في أي مكان — الأجر كامل',
        en: 'If crowded: pray wherever possible close to the Rawdah — full reward',
      },
      {
        ar: 'اتبعي المواقيت الإدارية المخصصة لدخول النساء',
        en: 'Follow the timings set by administration for women\'s access',
      },
      {
        ar: 'الاكتظاظ مع الرجال غير مشروع — الأجر الكامل ممكن بدونه',
        en: 'Crowding with men is not permitted — full reward is possible without it',
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function RawdahVisitScreen() {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const [selectedSection, setSelectedSection] = useState<RawdahSection | null>(null);

  // Drill-in: section detail
  if (selectedSection) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: isAr ? 'الروضة الشريفة' : 'The Rawdah' }} />
        <View style={styles.breadcrumb}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedSection(null)}>
            <FontAwesome5 name="arrow-left" size={14} color={Colors.goldAccent} />
            <Text style={styles.backLabel}>{isAr ? 'الروضة' : 'Rawdah'}</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbTitle}>
            {selectedSection.emoji} {isAr ? selectedSection.titleAr : selectedSection.titleEn}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
          {selectedSection.points.map((point, idx) => (
            <View key={idx} style={styles.pointCard}>
              <Text style={[styles.pointText, isAr && styles.rtl]}>
                {isAr ? point.ar : point.en}
              </Text>
              {!!point.source && (
                <Text style={[styles.pointSource, isAr && styles.rtl]}>
                  {point.source}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main screen: header + grid
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: isAr ? 'الروضة الشريفة' : 'The Rawdah' }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerCard}>
          <FontAwesome5 name="star-of-life" size={32} color={Colors.goldAccent} />
          <Text style={styles.headerTitle}>
            {isAr ? 'الروضة الشريفة' : 'The Rawdah Al-Sharifah'}
          </Text>
          <Text style={[styles.hadith, isAr && styles.rtl]}>
            {isAr
              ? '«ما بين بيتي ومنبري روضة من رياض الجنة»'
              : '"Between my house and my minbar is a garden from the gardens of Paradise"'}
          </Text>
          <Text style={styles.hadithSource}>
            {isAr ? 'رواه البخاري عن أبي هريرة ﵁' : 'Sahih Al-Bukhari 1196 — Abu Hurayrah ﵁'}
          </Text>
        </View>

        {/* Section grid */}
        <Text style={styles.gridLabel}>
          {isAr ? 'اختر موضوعاً' : 'Select a topic'}
        </Text>
        {chunk(SECTIONS, 3).map((row, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {row.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={styles.gridCard}
                onPress={() => setSelectedSection(section)}
                activeOpacity={0.75}
              >
                <View style={styles.gridIconWrap}>
                  <Text style={styles.gridEmoji}>{section.emoji}</Text>
                </View>
                <Text style={styles.gridCardTitle} numberOfLines={2}>
                  {isAr ? section.titleAr : section.titleEn}
                </Text>
                <View style={styles.gridCount}>
                  <Text style={styles.gridCountText}>{section.points.length}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`pad-${i}`} style={styles.gridCardPad} />
            ))}
          </View>
        ))}

        <Text style={styles.disclaimer}>
          {isAr
            ? '⚠️ إرشادات عامة — للفتاوى الملزمة راجع العلماء'
            : '⚠️ General guidance — for binding rulings consult a qualified scholar'}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 16, paddingBottom: 48 },
  // Header
  headerCard: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.goldAccent,
    textAlign: 'center',
  },
  hadith: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    borderLeftWidth: 3,
    borderLeftColor: Colors.goldAccent,
    paddingLeft: 12,
    marginTop: 4,
  },
  hadithSource: {
    fontSize: 11,
    color: Colors.white,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Grid
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandGreen,
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  gridRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  gridCardPad: { flex: 1 },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.goldAccent + '25',
    minHeight: 110,
    justifyContent: 'center',
  },
  gridIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.goldAccent + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridEmoji: { fontSize: 22 },
  gridCardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.brandGreen,
    textAlign: 'center',
    lineHeight: 15,
  },
  gridCount: {
    backgroundColor: Colors.goldAccent + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gridCountText: { fontSize: 11, fontWeight: '700', color: Colors.goldAccent },
  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.brandGreen,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAccent + '30',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 13, fontWeight: '600', color: Colors.goldAccent },
  breadcrumbTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.goldAccent,
    textAlign: 'center',
  },
  // Detail view
  detailScroll: { padding: 16, paddingBottom: 48 },
  pointCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '18',
    gap: 8,
  },
  pointText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 24,
    fontWeight: '500',
  },
  pointSource: {
    fontSize: 11,
    color: Colors.goldAccent,
    fontWeight: '600',
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: Colors.goldAccent + '25',
    paddingTop: 6,
  },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  disclaimer: {
    fontSize: 10,
    color: Colors.textPrimary,
    opacity: 0.35,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});
