import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import { AZKAR_DATABASE } from '../../src/data/azkar-database';

type Category = string;

const CATEGORY_META: Record<string, { en: string; ar: string; emoji: string }> = {
  talbiyah: { en: 'Talbiyah', ar: 'التلبية', emoji: '🔊' },
  general: { en: 'General', ar: 'عامة', emoji: '🤲' },
  entering_haram: { en: 'Entering Haram', ar: 'دخول الحرم', emoji: '🕌' },
  tawaf_general: { en: 'Tawaf', ar: 'الطواف', emoji: '🕋' },
  sai: { en: "Sa'i", ar: 'السعي', emoji: '🏃' },
};

const ORDERED_CATS = ['talbiyah', 'entering_haram', 'tawaf_general', 'sai', 'general'];

export default function AzkarScreen() {
  const persona = usePersonaStore((s) => s.persona);
  const isAr = (persona?.languageCode ?? 'en').startsWith('ar');

  const [activeCategory, setActiveCategory] = useState<Category>('talbiyah');
  const [expanded, setExpanded] = useState<string | null>(null);

  const items = AZKAR_DATABASE.filter((z) => z.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
      >
        {ORDERED_CATS.map((cat) => {
          const meta = CATEGORY_META[cat] ?? { en: cat, ar: cat, emoji: '📿' };
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => { setActiveCategory(cat); setExpanded(null); }}
            >
              <Text style={styles.pillEmoji}>{meta.emoji}</Text>
              <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>
                {isAr ? meta.ar : meta.en}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={styles.emptyNote}>No Athkar here yet.</Text>
        ) : (
          items.map((item) => {
            const isOpen = expanded === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, isOpen && styles.cardOpen]}
                onPress={() => setExpanded(isOpen ? null : item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.arabicText}>{item.arabicText}</Text>

                {item.repeatCount && item.repeatCount > 1 && (
                  <View style={styles.repeatBadge}>
                    <Text style={styles.repeatText}>×{item.repeatCount}</Text>
                  </View>
                )}

                {isOpen && (
                  <View style={styles.expandContent}>
                    <Text style={styles.transliteration}>{item.transliteration}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.translation}>{item.translationEn}</Text>
                    {!!item.source && <Text style={styles.source}>{item.source}</Text>}
                  </View>
                )}

                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  pills: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  pillActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  pillEmoji: { fontSize: 15 },
  pillLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  pillLabelActive: { color: Colors.white },
  scroll: { padding: 16, paddingBottom: 48 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    marginBottom: 12, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  cardOpen: { borderColor: Colors.brandGreen },
  arabicText: {
    fontSize: 22, color: Colors.brandGreen, fontWeight: '700',
    textAlign: 'right', lineHeight: 38, marginBottom: 4,
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
  source: { fontSize: 10, color: Colors.textPrimary, opacity: 0.35, marginTop: 2 },
  chevron: { fontSize: 10, color: Colors.textPrimary, opacity: 0.25, textAlign: 'right', marginTop: 4 },
  emptyNote: { fontSize: 14, color: Colors.textPrimary, opacity: 0.4, textAlign: 'center', paddingTop: 40 },
});
