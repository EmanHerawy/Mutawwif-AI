import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { HARAM_FACILITIES } from '../../../src/data/haram-facilities';
import { FacilityCard } from '../../../src/components/visit/FacilityCard';
import { Colors } from '../../../src/theme/colors';
import type { FacilityType } from '../../../src/types/facility.types';

type Filter = 'all' | 'accessible' | FacilityType;

const CATEGORY_META: { key: Filter; labelAr: string; labelEn: string; emoji: string; icon: string }[] = [
  { key: 'restroom',            labelAr: 'دورات المياه',      labelEn: 'Restrooms',        emoji: '🚻', icon: 'restroom' },
  { key: 'wudu',                labelAr: 'دُور الوضوء',        labelEn: 'Ablution',         emoji: '💧', icon: 'tint' },
  { key: 'medical',             labelAr: 'مراكز طبية',        labelEn: 'Medical',          emoji: '🏥', icon: 'first-aid' },
  { key: 'disability_services', labelAr: 'خدمات الإعاقة',     labelEn: 'Accessibility',    emoji: '♿', icon: 'wheelchair' },
  { key: 'baby_care',           labelAr: 'رعاية الأطفال',     labelEn: 'Baby Care',        emoji: '👶', icon: 'baby' },
  { key: 'zamzam',              labelAr: 'زمزم',              labelEn: 'Zamzam',           emoji: '🫙', icon: 'tint' },
  { key: 'information',         labelAr: 'معلومات',           labelEn: 'Information',      emoji: 'ℹ️', icon: 'info-circle' },
  { key: 'lost_found',          labelAr: 'مفقودات',           labelEn: 'Lost & Found',     emoji: '🔍', icon: 'search' },
  { key: 'pilgrim_services',    labelAr: 'خدمات الحجاج',      labelEn: 'Pilgrim Services', emoji: '🧳', icon: 'hands-helping' },
  { key: 'accessible',          labelAr: 'ممهد للجميع',       labelEn: 'Accessible',       emoji: '🦽', icon: 'wheelchair' },
];

export default function HaramFacilitiesScreen() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [filter, setFilter] = useState<Filter | null>(null);

  const counts = useMemo(() => {
    const map: Partial<Record<Filter, number>> = {};
    for (const meta of CATEGORY_META) {
      if (meta.key === 'accessible') {
        map[meta.key] = HARAM_FACILITIES.filter((f) => f.accessible).length;
      } else {
        map[meta.key] = HARAM_FACILITIES.filter((f) => f.type === meta.key).length;
      }
    }
    return map;
  }, []);

  const displayed = useMemo(() => {
    if (!filter) return [];
    if (filter === 'accessible') return HARAM_FACILITIES.filter((f) => f.accessible);
    return HARAM_FACILITIES.filter((f) => f.type === filter);
  }, [filter]);

  // Drill-in: list view
  if (filter) {
    const meta = CATEGORY_META.find((m) => m.key === filter);
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: isAr ? 'الخدمات' : 'Facilities' }} />
        <View style={styles.breadcrumb}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setFilter(null)}>
            <FontAwesome5 name="arrow-left" size={14} color={Colors.brandGreen} />
            <Text style={styles.backLabel}>{isAr ? 'الفئات' : 'Categories'}</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbTitle}>
            {meta?.emoji} {isAr ? meta?.labelAr : meta?.labelEn}
          </Text>
          <Text style={styles.breadcrumbCount}>{displayed.length}</Text>
        </View>
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FacilityCard item={item} />}
          contentContainerStyle={styles.listPad}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyNote}>{isAr ? 'لا توجد خدمات في هذه الفئة' : 'No facilities in this category'}</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  // Grid view
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: isAr ? 'الخدمات' : 'Facilities' }} />
      <FlatList
        data={CATEGORY_META}
        keyExtractor={(item) => item.key}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const count = counts[item.key] ?? 0;
          return (
            <TouchableOpacity
              style={[styles.gridCard, count === 0 && styles.gridCardDisabled]}
              onPress={() => count > 0 && setFilter(item.key)}
              activeOpacity={count > 0 ? 0.75 : 1}
            >
              <View style={styles.gridIconWrap}>
                <Text style={styles.gridEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.gridLabel} numberOfLines={2}>
                {isAr ? item.labelAr : item.labelEn}
              </Text>
              <View style={[styles.gridCount, count === 0 && { backgroundColor: Colors.textPrimary + '10' }]}>
                <Text style={[styles.gridCountText, count === 0 && { color: Colors.textPrimary, opacity: 0.3 }]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <FontAwesome5 name="map-marked-alt" size={28} color={Colors.goldAccent} />
            <Text style={styles.headerTitle}>{isAr ? 'خدمات المسجد الحرام' : 'Masjid Al Haram Facilities'}</Text>
            <Text style={styles.headerSub}>
              {HARAM_FACILITIES.length} {isAr ? 'خدمة' : 'facilities'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  headerCard: {
    backgroundColor: Colors.brandGreen, borderRadius: 16, padding: 18,
    alignItems: 'center', gap: 6, margin: 16, marginBottom: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: '800', color: Colors.goldAccent },
  headerSub: { fontSize: 11, color: Colors.white, opacity: 0.65 },
  grid: { padding: 16, paddingBottom: 40 },
  gridRow: { gap: 10, marginBottom: 10 },
  gridCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '18',
    minHeight: 110, justifyContent: 'center',
  },
  gridCardDisabled: { opacity: 0.45 },
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
  breadcrumbCount: { fontSize: 12, fontWeight: '700', color: Colors.goldAccent },
  listPad: { paddingHorizontal: 16, paddingBottom: 40 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyNote: { fontSize: 14, color: Colors.textPrimary, opacity: 0.4 },
});
