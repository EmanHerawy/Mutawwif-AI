import { useState, useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA, ETIQUETTE_CATEGORY_LABELS } from '../../../src/data/etiquette';
import { EtiquetteCard } from '../../../src/components/etiquette/EtiquetteCard';
import { EtiquetteScreenHeader } from '../../../src/components/etiquette/EtiquetteScreenHeader';
import type { EtiquetteCategory, EtiquetteItem } from '../../../src/types/etiquette.types';
import { Colors } from '../../../src/theme/colors';

const CATEGORY_ORDER: EtiquetteCategory[] = [
  'ihram_prohibitions',
  'common_mistakes',
  'masjid_haram_adab',
  'masjid_nabawi_adab',
  'makkah_madinah_adab',
  'rawdah_adab',
  'sitting_adab',
  'itikaf_adab',
  'general_adab',
];

export default function EtiquetteIndexScreen() {
  const { i18n } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const [selectedCat, setSelectedCat] = useState<EtiquetteCategory | 'all'>('all');

  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  // Gender-filtered full dataset
  const genderFiltered = useMemo(
    () => ETIQUETTE_DATA.filter(
      (item) => item.applicableTo === 'all' || item.applicableTo === gender,
    ),
    [gender],
  );

  // Build sections: one per category (filtered when a category is selected)
  const sections = useMemo(() => {
    const cats = selectedCat === 'all' ? CATEGORY_ORDER : [selectedCat];
    return cats
      .map((cat) => ({
        category: cat,
        data: genderFiltered.filter((item) => item.category === cat),
      }))
      .filter((s) => s.data.length > 0);
  }, [selectedCat, genderFiltered]);

  const filteredCount = useMemo(
    () => sections.reduce((acc, s) => acc + s.data.length, 0),
    [sections],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: isAr ? 'آداب الحرمين' : 'Etiquette Guide' }} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: EtiquetteItem }) => <EtiquetteCard item={item} />}
        renderSectionHeader={({ section }) => {
          if (selectedCat !== 'all') return null; // no header when filtered to one cat
          const label = ETIQUETTE_CATEGORY_LABELS[section.category];
          return (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>{label.emoji}</Text>
              <Text style={styles.sectionTitle}>
                {isAr ? label.ar : label.en}
              </Text>
              <View style={styles.sectionCount}>
                <Text style={styles.sectionCountText}>{section.data.length}</Text>
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <View style={styles.headerWrapper}>
            <EtiquetteScreenHeader
              selected={selectedCat}
              onSelect={setSelectedCat}
              isAr={isAr}
              filteredCount={filteredCount}
            />
          </View>
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  headerWrapper: { paddingHorizontal: 16, paddingTop: 12 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.brandGreen,
    flex: 1,
  },
  sectionCount: {
    backgroundColor: Colors.brandGreen + '18',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandGreen,
  },
});
