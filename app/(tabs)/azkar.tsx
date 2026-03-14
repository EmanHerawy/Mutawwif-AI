import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../src/theme/colors';
import { AZKAR_DATABASE } from '../../src/data/azkar-database';
import { useAzkarSessionStore } from '../../src/stores/azkarSessionStore';
import { SpeakerWarningDialog } from '../../src/components/azkar/SpeakerWarningDialog';
import type { AzkarItem } from '../../src/types/azkar.types';

type Category = string;

const CATEGORY_META: Record<string, { en: string; ar: string; icon: string }> = {
  talbiyah:       { en: 'Talbiyah',       ar: 'التلبية',        icon: 'microphone-alt' },
  entering_haram: { en: 'Enter Haram',    ar: 'دخول الحرم',     icon: 'mosque' },
  tawaf_general:  { en: 'Tawaf',          ar: 'الطواف',          icon: 'kaaba' },
  maqam_ibrahim:  { en: 'Maqam Ibrahim',  ar: 'مقام إبراهيم',   icon: 'pray' },
  sai:            { en: "Sa'i",           ar: 'السعي',           icon: 'running' },
  zamzam:         { en: 'Zamzam',         ar: 'زمزم',            icon: 'tint' },
  hajj_rites:     { en: 'Hajj Rites',     ar: 'مناسك الحج',      icon: 'campground' },
  nabawi:         { en: 'Al-Nabawi',      ar: 'المسجد النبوي',   icon: 'place-of-worship' },
  general:        { en: 'General',        ar: 'عامة',            icon: 'hands' },
};

const ORDERED_CATS = [
  'talbiyah', 'entering_haram', 'tawaf_general', 'maqam_ibrahim',
  'sai', 'zamzam', 'hajj_rites', 'nabawi', 'general',
];

export default function AzkarScreen() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [activeCategory, setActiveCategory] = useState<Category>('talbiyah');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showSpeakerWarning, setShowSpeakerWarning] = useState(false);
  const [pendingAudioId, setPendingAudioId] = useState<string | null>(null);

  const sessionActive = useAzkarSessionStore((s) => s.sessionActive);
  const counters = useAzkarSessionStore((s) => s.counters);
  const speakerAcknowledged = useAzkarSessionStore((s) => s.speakerWarningAcknowledged);
  const startSession = useAzkarSessionStore((s) => s.startSession);
  const endSession = useAzkarSessionStore((s) => s.endSession);
  const increment = useAzkarSessionStore((s) => s.increment);
  const resetItem = useAzkarSessionStore((s) => s.resetItem);
  const acknowledgeSpeakerWarning = useAzkarSessionStore((s) => s.acknowledgeSpeakerWarning);

  const items = AZKAR_DATABASE.filter((z) => z.category === activeCategory);

  const handlePlayAudio = (item: AzkarItem) => {
    if (!item.audioFile) return;
    if (!speakerAcknowledged) {
      setPendingAudioId(item.id);
      setShowSpeakerWarning(true);
      return;
    }
    // Audio playback will be wired when audio assets are available
  };

  const handleSpeakerAcknowledge = () => {
    acknowledgeSpeakerWarning();
    setShowSpeakerWarning(false);
    // Resume pending audio once assets are available
    setPendingAudioId(null);
  };

  const totalDone = Object.values(counters).reduce((sum, n) => sum + (n > 0 ? 1 : 0), 0);
  const totalItems = items.length;
  const categoryDone = items.filter((i) => (counters[i.id] ?? 0) >= i.repeatCount).length;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsScroll}
        contentContainerStyle={styles.pills}
      >
        {ORDERED_CATS.map((cat) => {
          const meta = CATEGORY_META[cat] ?? { en: cat, ar: cat, icon: 'circle' };
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => { setActiveCategory(cat); setExpanded(null); }}
            >
              <FontAwesome5 name={meta.icon as any} size={13} color={isActive ? Colors.white : Colors.brandGreen} />
              <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>
                {isAr ? meta.ar : meta.en}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Session bar */}
      <View style={styles.sessionBar}>
        {sessionActive ? (
          <>
            <View style={styles.sessionProgress}>
              <Text style={styles.sessionProgressText}>
                {categoryDone}/{totalItems} {isAr ? 'مكتمل' : 'done'}
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${totalItems > 0 ? (categoryDone / totalItems) * 100 : 0}%` }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.endSessionBtn} onPress={endSession}>
              <Text style={styles.endSessionText}>{isAr ? 'إنهاء' : 'End'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.startSessionBtn} onPress={startSession}>
            <FontAwesome5 name="play" size={11} color={Colors.white} />
            <Text style={styles.startSessionText}>{isAr ? 'بدء جلسة ذكر' : 'Start Dhikr Session'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Azkar list */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={styles.emptyNote}>
            {isAr ? 'لا توجد أذكار في هذه الفئة بعد.' : 'No Athkar in this category yet.'}
          </Text>
        ) : (
          items.map((item) => {
            const isOpen = expanded === item.id;
            const count = counters[item.id] ?? 0;
            const isDone = count >= item.repeatCount;
            const hasAudio = !!item.audioFile;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isOpen && styles.cardOpen, isDone && sessionActive && styles.cardDone]}
                onPress={() => setExpanded(isOpen ? null : item.id)}
                activeOpacity={0.8}
              >
                {/* Done checkmark */}
                {isDone && sessionActive && (
                  <View style={styles.doneBadge}>
                    <FontAwesome5 name="check" size={9} color={Colors.white} />
                  </View>
                )}

                {/* Occasion — when/where to say this dhikr */}
                {!!(isAr ? item.occasionAr : item.occasionEn) && (
                  <View style={styles.occasionRow}>
                    <Text style={styles.occasionText}>
                      {isAr ? item.occasionAr : item.occasionEn}
                    </Text>
                  </View>
                )}

                <Text style={styles.arabicText}>{item.arabicText}</Text>

                {item.repeatCount > 1 && (
                  <View style={styles.repeatBadge}>
                    <Text style={styles.repeatText}>×{item.repeatCount}</Text>
                  </View>
                )}

                {isOpen && (
                  <View style={styles.expandContent}>
                    {!!item.transliteration && (
                      <Text style={styles.transliteration}>{item.transliteration}</Text>
                    )}
                    <View style={styles.divider} />
                    <Text style={styles.translation}>{item.translationEn}</Text>
                    {!!item.source && <Text style={styles.source}>{item.source}</Text>}

                    {/* Tasbih counter */}
                    {sessionActive && (
                      <View style={styles.counterRow}>
                        <TouchableOpacity
                          style={styles.counterResetBtn}
                          onPress={() => resetItem(item.id)}
                        >
                          <FontAwesome5 name="undo" size={11} color={Colors.brandGreen} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.tapBtn, isDone && styles.tapBtnDone]}
                          onPress={() => !isDone && increment(item.id)}
                          disabled={isDone}
                        >
                          <Text style={styles.tapBtnCount}>{count}</Text>
                          <Text style={styles.tapBtnOf}>/ {item.repeatCount}</Text>
                        </TouchableOpacity>

                        {hasAudio && (
                          <TouchableOpacity
                            style={styles.audioBtn}
                            onPress={() => handlePlayAudio(item)}
                          >
                            <FontAwesome5 name="volume-up" size={14} color={Colors.brandGreen} />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                )}

                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <SpeakerWarningDialog
        visible={showSpeakerWarning}
        onAcknowledge={handleSpeakerAcknowledge}
        onCancel={() => { setShowSpeakerWarning(false); setPendingAudioId(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  pillsScroll: { flexGrow: 0, flexShrink: 0 },
  pills: { paddingHorizontal: 16, paddingVertical: 14, gap: 10, alignItems: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24,
    minHeight: 44,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  pillActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  pillLabel: { fontSize: 14, fontWeight: '600', color: Colors.brandGreen },
  pillLabelActive: { color: Colors.white },

  sessionBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10, gap: 12,
  },
  startSessionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.brandGreen, borderRadius: 10,
    paddingVertical: 10,
  },
  startSessionText: { fontSize: 13, fontWeight: '700', color: Colors.white },
  sessionProgress: { flex: 1, gap: 4 },
  sessionProgressText: { fontSize: 11, color: Colors.brandGreen, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: Colors.brandGreen + '22', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.brandGreen, borderRadius: 2 },
  endSessionBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1.5, borderColor: Colors.brandGreen + '44',
  },
  endSessionText: { fontSize: 12, fontWeight: '600', color: Colors.brandGreen },

  scroll: { padding: 16, paddingBottom: 48 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    marginBottom: 12, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
    overflow: 'hidden',
  },
  cardOpen: { borderColor: Colors.brandGreen },
  cardDone: { borderColor: Colors.brandGreen + '88', backgroundColor: Colors.brandGreen + '08' },
  doneBadge: {
    position: 'absolute', top: 12, left: 12,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.brandGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  arabicText: {
    fontSize: 22, color: Colors.brandGreen, fontWeight: '700',
    textAlign: 'right', lineHeight: 38, marginBottom: 4,
    flexShrink: 1, flexWrap: 'wrap',
  },
  repeatBadge: {
    alignSelf: 'flex-end', backgroundColor: Colors.goldAccent + '25',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 4,
  },
  repeatText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '700' },
  expandContent: { marginTop: 12 },
  transliteration: {
    fontSize: 12, color: Colors.textPrimary, opacity: 0.5,
    fontStyle: 'italic', lineHeight: 20, marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: Colors.brandGreen + '15', marginBottom: 10 },
  translation: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, marginBottom: 6 },
  source: { fontSize: 10, color: Colors.textPrimary, opacity: 0.35, marginTop: 2, marginBottom: 12 },
  chevron: { fontSize: 10, color: Colors.textPrimary, opacity: 0.25, textAlign: 'right', marginTop: 4 },
  emptyNote: { fontSize: 14, color: Colors.textPrimary, opacity: 0.4, textAlign: 'center', paddingTop: 40 },

  counterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4,
  },
  counterResetBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  tapBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, backgroundColor: Colors.brandGreen, borderRadius: 12,
    paddingVertical: 12,
  },
  tapBtnDone: { backgroundColor: Colors.brandGreen + '55' },
  tapBtnCount: { fontSize: 20, fontWeight: '800', color: Colors.white },
  tapBtnOf: { fontSize: 12, color: Colors.white, opacity: 0.7, marginTop: 3 },
  audioBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.brandGreen + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  occasionRow: {
    backgroundColor: Colors.goldAccent + '18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  occasionText: {
    fontSize: 11,
    color: Colors.goldAccent,
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 17,
    flexShrink: 1,
  },
});
