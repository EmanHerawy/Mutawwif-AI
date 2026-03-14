import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA, ETIQUETTE_CATEGORY_LABELS } from '../../../src/data/etiquette';
import { EtiquetteCard } from '../../../src/components/etiquette/EtiquetteCard';
import type { EtiquetteCategory, EtiquetteItem } from '../../../src/types/etiquette.types';
import { Colors } from '../../../src/theme/colors';

const EXCLUDED_CATEGORIES = new Set(['hajj_umrah_rites', 'ihram_prohibitions', 'ihram_permissions', 'hajj_management']);

const CATEGORY_ORDER: EtiquetteCategory[] = [
  'masjid_adab',
  'makkah_madinah_adab',
  'common_mistakes',
  'sitting_adab',
  'general_adab',
];

export default function HaramVisitScreen() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const [selectedCat, setSelectedCat] = useState<EtiquetteCategory | null>(null);

  const genderFiltered = useMemo(() =>
    ETIQUETTE_DATA.filter((item) =>
      (item.mosque === 'haram' || item.mosque === 'both') &&
      !EXCLUDED_CATEGORIES.has(item.category) &&
      (item.applicableTo === 'all' || item.applicableTo === gender),
    ),
    [gender],
  );

  const categoryGridItems = useMemo(() =>
    CATEGORY_ORDER.map((cat) => ({
      cat,
      count: genderFiltered.filter((item) => item.category === cat).length,
    })).filter((c) => c.count > 0),
    [genderFiltered],
  );

  const selectedItems = useMemo(() => {
    if (!selectedCat) return [];
    return genderFiltered.filter((item) => item.category === selectedCat);
  }, [selectedCat, genderFiltered]);

  const NAV_CARDS = [
    { titleEn: 'Gates', titleAr: 'البوابات', icon: 'door-open', onPress: () => router.push('/(visit)/haram/gates') },
    { titleEn: 'Facilities', titleAr: 'الخدمات', icon: 'map-marked-alt', onPress: () => router.push('/(visit)/haram/facilities') },
  ];

  // Drill-in: single category
  if (selectedCat) {
    const label = ETIQUETTE_CATEGORY_LABELS[selectedCat];
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: isAr ? 'المسجد الحرام' : 'Masjid Al Haram' }} />
        <View style={styles.breadcrumb}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedCat(null)}>
            <FontAwesome5 name="arrow-left" size={14} color={Colors.brandGreen} />
            <Text style={styles.backLabel}>{isAr ? 'الرئيسية' : 'Home'}</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbTitle}>
            {label?.emoji} {isAr ? label?.ar : label?.en}
          </Text>
        </View>
        <FlatList
          data={selectedItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: EtiquetteItem }) => <EtiquetteCard item={item} />}
          contentContainerStyle={styles.listPad}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: isAr ? 'المسجد الحرام' : 'Masjid Al Haram' }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerIconBox}>
            <FontAwesome5 name="mosque" size={32} color={Colors.goldAccent} solid />
          </View>
          <Text style={styles.headerTitle}>{isAr ? 'المسجد الحرام' : 'Masjid Al Haram'}</Text>
          <Text style={styles.headerSubtitle}>
            {isAr ? 'بوابات • خدمات • آداب' : 'Gates • Facilities • Etiquette'}
          </Text>
        </View>

        {/* Nav cards */}
        <Text style={styles.sectionLabel}>{isAr ? 'استكشف' : 'Explore'}</Text>
        <View style={styles.navRow}>
          {NAV_CARDS.map((c) => (
            <TouchableOpacity key={c.titleEn} style={styles.navCard} onPress={c.onPress} activeOpacity={0.75}>
              <View style={styles.navIcon}>
                <FontAwesome5 name={c.icon as any} size={20} color={Colors.brandGreen} />
              </View>
              <Text style={styles.navLabel}>{isAr ? c.titleAr : c.titleEn}</Text>
              <FontAwesome5 name="chevron-right" size={10} color={Colors.brandGreen} style={{ opacity: 0.4 }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Etiquette categories grid */}
        <Text style={styles.sectionLabel}>{isAr ? 'آداب الحرم' : 'Haram Etiquette'}</Text>
        <View style={styles.grid}>
          {categoryGridItems.map((item) => {
            const label = ETIQUETTE_CATEGORY_LABELS[item.cat];
            return (
              <TouchableOpacity
                key={item.cat}
                style={styles.gridCard}
                onPress={() => setSelectedCat(item.cat)}
                activeOpacity={0.75}
              >
                <View style={styles.gridIconWrap}>
                  <Text style={styles.gridEmoji}>{label?.emoji ?? '📋'}</Text>
                </View>
                <Text style={styles.gridLabel} numberOfLines={2}>
                  {isAr ? label?.ar : label?.en}
                </Text>
                <View style={styles.gridCount}>
                  <Text style={styles.gridCountText}>{item.count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

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
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  headerIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.white + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.goldAccent },
  headerSubtitle: { fontSize: 12, color: Colors.white, opacity: 0.7 },
  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandGreen,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  // Nav cards
  navRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  navCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '22', gap: 10,
  },
  navIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.brandGreen + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.brandGreen },
  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '18',
    minHeight: 110,
    justifyContent: 'center',
  },
  gridIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: Colors.brandGreen + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  gridEmoji: { fontSize: 22 },
  gridLabel: { fontSize: 11, fontWeight: '600', color: Colors.brandGreen, textAlign: 'center', lineHeight: 15 },
  gridCount: {
    backgroundColor: Colors.goldAccent + '20', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  gridCountText: { fontSize: 11, fontWeight: '700', color: Colors.goldAccent },
  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '15',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  breadcrumbTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.brandGreen, textAlign: 'center' },
  listPad: { paddingHorizontal: 16, paddingBottom: 40 },
});
