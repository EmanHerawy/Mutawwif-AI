import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NABAWI_FACILITIES } from '../../../src/data/nabawi-facilities';
import { FacilityCard } from '../../../src/components/visit/FacilityCard';
import { Colors } from '../../../src/theme/colors';
import type { FacilityType } from '../../../src/types/facility.types';

type Filter = 'all' | 'accessible' | FacilityType;

const FILTER_META: { key: Filter; labelAr: string; labelEn: string; icon: string }[] = [
  { key: 'all',                 labelAr: 'الكل',                  labelEn: 'All',              icon: 'th-large' },
  { key: 'accessible',          labelAr: 'ممهد للمعاقين',          labelEn: 'Accessible',       icon: 'wheelchair' },
  { key: 'restroom',            labelAr: 'دورات المياه',           labelEn: 'Restrooms',        icon: 'restroom' },
  { key: 'wudu',                labelAr: 'دور الوضوء',             labelEn: 'Ablution',         icon: 'tint' },
  { key: 'medical',             labelAr: 'مراكز طبية',             labelEn: 'Medical',          icon: 'first-aid' },
  { key: 'pharmacy',            labelAr: 'صيدلية',                 labelEn: 'Pharmacy',         icon: 'pills' },
  { key: 'disability_services', labelAr: 'خدمات الإعاقة',          labelEn: 'Disability',       icon: 'wheelchair' },
  { key: 'baby_care',           labelAr: 'رعاية الأطفال',           labelEn: 'Baby Care',        icon: 'baby' },
  { key: 'zamzam',              labelAr: 'زمزم',                   labelEn: 'Zamzam',           icon: 'tint' },
  { key: 'information',         labelAr: 'معلومات',                labelEn: 'Info',             icon: 'info-circle' },
  { key: 'lost_found',          labelAr: 'مفقودات',                labelEn: 'Lost & Found',     icon: 'search' },
  { key: 'pilgrim_services',    labelAr: 'خدمات الزوار',           labelEn: 'Visitor Services', icon: 'hands-helping' },
];

export default function NabawiFacilitiesScreen() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [filter, setFilter] = useState<Filter>('all');

  const displayed = NABAWI_FACILITIES.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'accessible') return f.accessible;
    return f.type === filter;
  });

  return (
    <>
      <Stack.Screen options={{ title: isAr ? 'الخدمات' : 'Facilities' }} />
      <View style={styles.container}>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsScroll}
          contentContainerStyle={styles.pills}
        >
          {FILTER_META.map(({ key, labelAr, labelEn, icon }) => {
            const active = filter === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setFilter(key)}
              >
                <FontAwesome5 name={icon as any} size={12} color={active ? Colors.white : Colors.brandGreen} />
                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                  {isAr ? labelAr : labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results count */}
        <Text style={styles.count}>
          {displayed.length} {isAr ? 'خدمة' : 'facilities'}
        </Text>

        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FacilityCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchmentBg },
  pillsScroll: { flexGrow: 0, flexShrink: 0, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.parchmentBg },
  pills: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, alignItems: 'center' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, minHeight: 38,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
    backgroundColor: Colors.white,
  },
  pillActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  pillLabel: { fontSize: 12, fontWeight: '600', color: Colors.brandGreen },
  pillLabelActive: { color: Colors.white },
  count: {
    paddingHorizontal: 16, paddingVertical: 8,
    fontSize: 12, color: Colors.textPrimary, opacity: 0.5,
  },
  list: { paddingBottom: 32 },
});
