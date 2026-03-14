import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { useAzkarPrefsStore } from '../../../src/stores/azkarPrefsStore';
import { ETIQUETTE_DATA, ETIQUETTE_CATEGORY_LABELS } from '../../../src/data/etiquette';
import { EtiquetteCard } from '../../../src/components/etiquette/EtiquetteCard';
import type { EtiquetteCategory, EtiquetteItem } from '../../../src/types/etiquette.types';
import { Colors } from '../../../src/theme/colors';

type Tab = 'categories' | 'favorites';

const CATEGORY_ORDER: EtiquetteCategory[] = [
  'ihram_prohibitions',
  'ihram_permissions',
  'hajj_umrah_rites',
  'common_mistakes',
  'hajj_management',
  'masjid_adab',
  'makkah_madinah_adab',
  'rawdah_adab',
  'sitting_adab',
  'itikaf_adab',
  'general_adab',
];

export default function EtiquetteIndexScreen() {
  const { i18n } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const etiquetteFavoriteIds = useAzkarPrefsStore((s) => s.etiquetteFavoriteIds);

  const [tab, setTab] = useState<Tab>('categories');
  const [selectedCat, setSelectedCat] = useState<EtiquetteCategory | null>(null);

  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const genderFiltered = useMemo(
    () => ETIQUETTE_DATA.filter(
      (item) => item.applicableTo === 'all' || item.applicableTo === gender,
    ),
    [gender],
  );

  // Category grid data with counts
  const categoryGridItems = useMemo(() =>
    CATEGORY_ORDER.map((cat) => ({
      cat,
      count: genderFiltered.filter((item) => item.category === cat).length,
    })).filter((c) => c.count > 0),
    [genderFiltered],
  );

  // Items for selected category
  const selectedItems = useMemo(() => {
    if (!selectedCat) return [];
    return genderFiltered.filter((item) => item.category === selectedCat);
  }, [selectedCat, genderFiltered]);

  // Favorites section
  const favoriteSections = useMemo(() => {
    const favItems = genderFiltered.filter((item) => etiquetteFavoriteIds.includes(item.id));
    if (favItems.length === 0) return [];
    return [{ category: 'favorites' as any, data: favItems }];
  }, [genderFiltered, etiquetteFavoriteIds]);

  // ── Drill-in: single category list ──
  if (tab === 'categories' && selectedCat) {
    const label = ETIQUETTE_CATEGORY_LABELS[selectedCat];
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: isAr ? 'آداب الحرمين' : 'Etiquette Guide' }} />
        <View style={styles.breadcrumb}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedCat(null)}>
            <FontAwesome5 name="arrow-left" size={14} color={Colors.brandGreen} />
            <Text style={styles.backLabel}>{isAr ? 'الفئات' : 'Categories'}</Text>
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
      <Stack.Screen options={{ title: isAr ? 'آداب الحرمين' : 'Etiquette Guide' }} />

      {/* Tab switcher */}
      <View style={styles.topBar}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'categories' && styles.tabBtnActive]}
            onPress={() => setTab('categories')}
          >
            <FontAwesome5
              name="th-large"
              size={12}
              color={tab === 'categories' ? Colors.white : Colors.brandGreen}
            />
            <Text style={[styles.tabBtnLabel, tab === 'categories' && styles.tabBtnLabelActive]}>
              {isAr ? 'الفئات' : 'Categories'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'favorites' && styles.tabBtnActive]}
            onPress={() => setTab('favorites')}
          >
            <FontAwesome5
              name="heart"
              solid
              size={12}
              color={tab === 'favorites' ? Colors.white : '#E53E3E'}
            />
            <Text style={[styles.tabBtnLabel, tab === 'favorites' && styles.tabBtnLabelActive]}>
              {isAr ? 'المفضلة' : 'Favorites'}
              {etiquetteFavoriteIds.length > 0 && (
                <Text style={styles.favCount}> {etiquetteFavoriteIds.length}</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories grid */}
      {tab === 'categories' && (
        <FlatList
          data={categoryGridItems}
          keyExtractor={(item) => item.cat}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => {
            const label = ETIQUETTE_CATEGORY_LABELS[item.cat];
            return (
              <TouchableOpacity
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
          }}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Favorites */}
      {tab === 'favorites' && (
        <SectionList
          sections={favoriteSections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: EtiquetteItem }) => <EtiquetteCard item={item} />}
          renderSectionHeader={() => (
            <View style={styles.sectionHeader}>
              <FontAwesome5 name="heart" solid size={14} color="#E53E3E" />
              <Text style={[styles.sectionTitle, { color: '#E53E3E' }]}>
                {isAr ? 'المفضلة' : 'Favorites'}
              </Text>
              <View style={styles.sectionCount}>
                <Text style={styles.sectionCountText}>{etiquetteFavoriteIds.length}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome5 name="heart" size={36} color="#E53E3E" style={{ opacity: 0.2, marginBottom: 12 }} />
              <Text style={styles.emptyNote}>
                {isAr
                  ? 'لا توجد مفضلة بعد.\nاضغط ♡ على أي بند لحفظه.'
                  : 'No favorites yet.\nTap ♡ on any item to save it.'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listPad}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  topBar: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.brandGreen + '14',
    borderRadius: 12, padding: 3, gap: 3,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, borderRadius: 9,
  },
  tabBtnActive: { backgroundColor: Colors.brandGreen },
  tabBtnLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  tabBtnLabelActive: { color: Colors.white },
  favCount: { fontSize: 11, fontWeight: '700' },
  // Grid
  grid: { padding: 16, paddingBottom: 40 },
  gridRow: { gap: 10, marginBottom: 10 },
  gridCard: {
    flex: 1,
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
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: Colors.brandGreen + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridEmoji: { fontSize: 22 },
  gridLabel: {
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
  // Breadcrumb / drill-in
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.brandGreen + '15',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  breadcrumbTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: Colors.brandGreen, textAlign: 'center' },
  listPad: { paddingHorizontal: 16, paddingBottom: 40 },
  // Section header (favorites)
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 16, marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  sectionCount: {
    backgroundColor: Colors.brandGreen + '18', borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  sectionCountText: { fontSize: 12, fontWeight: '700', color: Colors.brandGreen },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyNote: { fontSize: 14, color: Colors.textPrimary, opacity: 0.4, textAlign: 'center', lineHeight: 22 },
});
