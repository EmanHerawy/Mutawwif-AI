import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import type { FacilityInfo, FacilityType, FacilityFloor, FacilityWing } from '../../types/facility.types';

const TYPE_COLORS: Record<FacilityType, string> = {
  restroom:            '#6B7280',
  wudu:                '#0EA5E9',
  medical:             '#EF4444',
  pharmacy:            '#F97316',
  disability_services: '#3B82F6',
  baby_care:           '#EC4899',
  information:         '#8B5CF6',
  lost_found:          '#C9A84C',
  zamzam:              '#06B6D4',
  pilgrim_services:    '#1B4332',
};

const TYPE_ICONS: Record<FacilityType, string> = {
  restroom:            'restroom',
  wudu:                'tint',
  medical:             'first-aid',
  pharmacy:            'pills',
  disability_services: 'wheelchair',
  baby_care:           'baby',
  information:         'info-circle',
  lost_found:          'search',
  zamzam:              'tint',
  pilgrim_services:    'hands-helping',
};

const FLOOR_LABEL_AR: Record<FacilityFloor, string> = {
  basement_2: 'بدروم ٢',
  basement_1: 'بدروم ١',
  ground:     'أرضي',
  floor_1:    'أول',
  floor_2:    'ثانٍ',
};

const FLOOR_LABEL_EN: Record<FacilityFloor, string> = {
  basement_2: 'B2',
  basement_1: 'B1',
  ground:     'Ground',
  floor_1:    '1st Floor',
  floor_2:    '2nd Floor',
};

const WING_AR: Record<FacilityWing, string> = {
  north:     'شمال', south:     'جنوب',
  east:      'شرق',  west:      'غرب',
  northeast: 'شمال شرقي', northwest: 'شمال غربي',
  southeast: 'جنوب شرقي', southwest: 'جنوب غربي',
  central:   'مركزي',
};

const WING_EN: Record<FacilityWing, string> = {
  north: 'North', south: 'South',
  east:  'East',  west:  'West',
  northeast: 'NE', northwest: 'NW',
  southeast: 'SE', southwest: 'SW',
  central: 'Central',
};

const TYPE_NAME_AR: Record<FacilityType, string> = {
  restroom:            'دورة مياه',
  wudu:                'دار وضوء',
  medical:             'مركز طبي',
  pharmacy:            'صيدلية',
  disability_services: 'خدمات ذوي الإعاقة',
  baby_care:           'رعاية الأطفال',
  information:         'مركز معلومات',
  lost_found:          'مفقودات وموجودات',
  zamzam:              'ماء زمزم',
  pilgrim_services:    'خدمات الحجاج',
};

const TYPE_NAME_EN: Record<FacilityType, string> = {
  restroom:            'Restroom',
  wudu:                'Ablution',
  medical:             'Medical',
  pharmacy:            'Pharmacy',
  disability_services: 'Disability Services',
  baby_care:           'Baby Care',
  information:         'Information',
  lost_found:          'Lost & Found',
  zamzam:              'Zamzam Water',
  pilgrim_services:    'Pilgrim Services',
};

interface Props {
  item: FacilityInfo;
}

export function FacilityCard({ item }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const typeColor = TYPE_COLORS[item.type];
  const typeIcon  = TYPE_ICONS[item.type];

  return (
    <View style={styles.card}>
      {/* Left color bar — type indicator */}
      <View style={[styles.typeBar, { backgroundColor: typeColor }]} />

      <View style={styles.content}>
        {/* Type badge + name */}
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '18' }]}>
            <FontAwesome5 name={typeIcon as any} size={12} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>
              {isAr ? TYPE_NAME_AR[item.type] : TYPE_NAME_EN[item.type]}
            </Text>
          </View>
          {item.accessible && (
            <View style={styles.accessibleBadge}>
              <FontAwesome5 name="wheelchair" size={12} color={Colors.brandGreen} />
              <Text style={styles.accessibleText}>
                {isAr ? 'ممهد للمعاقين' : 'Accessible'}
              </Text>
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={styles.name} numberOfLines={2}>
          {isAr ? item.nameAr : item.nameEn}
        </Text>

        {/* Location — most important field */}
        <View style={styles.locationRow}>
          <FontAwesome5 name="map-marker-alt" size={11} color={Colors.brandGreen} style={styles.locationIcon} />
          <Text style={styles.locationText}>
            {isAr ? item.locationAr : item.locationEn}
          </Text>
        </View>

        {/* Meta row: floor + wing + hours */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {isAr ? FLOOR_LABEL_AR[item.floor] : FLOOR_LABEL_EN[item.floor]}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {isAr ? WING_AR[item.wing] : WING_EN[item.wing]}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <FontAwesome5 name="clock" size={9} color={Colors.textPrimary} style={{ opacity: 0.5, marginRight: 3 }} />
            <Text style={styles.metaChipText}>{item.operatingHours}</Text>
          </View>
        </View>

        {/* Notes */}
        {!!(isAr ? item.notesAr : item.notesEn) && (
          <Text style={styles.notes}>
            {isAr ? item.notesAr : item.notesEn}
          </Text>
        )}

        <Text style={styles.mockBadge}>⚪ {isAr ? 'بيانات تقريبية — تحقق على أرض الواقع' : 'Mock data — verify on-site'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  accessibleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandGreen + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  accessibleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandGreen,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locationIcon: {
    marginTop: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.parchmentBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  metaChipText: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.65,
  },
  notes: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.55,
    fontStyle: 'italic',
    lineHeight: 17,
    textAlign: 'right',
  },
  mockBadge: {
    fontSize: 10,
    color: Colors.textPrimary,
    opacity: 0.4,
    marginTop: 2,
  },
});
