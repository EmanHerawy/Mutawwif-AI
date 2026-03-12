import { View, Text, ScrollView, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { EtiquetteCategory } from '../../types/etiquette.types';
import { ETIQUETTE_CATEGORY_LABELS, ETIQUETTE_DATA } from '../../data/etiquette';
import { Colors } from '../../theme/colors';

const ALL_CATEGORIES: EtiquetteCategory[] = [
  'ihram_prohibitions',
  'ihram_permissions',
  'common_mistakes',
  'hajj_management',
  'masjid_adab',
  'makkah_madinah_adab',
  'rawdah_adab',
  'sitting_adab',
  'itikaf_adab',
  'general_adab',
];

interface Props {
  selected: EtiquetteCategory | 'all';
  onSelect: (cat: EtiquetteCategory | 'all') => void;
  isAr: boolean;
  filteredCount: number;
}

export function EtiquetteScreenHeader({ selected, onSelect, isAr, filteredCount }: Props) {
  const { t } = useTranslation();
  const total = ETIQUETTE_DATA.length;

  return (
    <View style={styles.container}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{t('etiquette.screen_title')}</Text>
          <Text style={styles.subtitle}>{t('etiquette.screen_subtitle')}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countNum}>{selected === 'all' ? `${total}+` : filteredCount}</Text>
          <Text style={styles.countLabel}>{isAr ? 'حكم' : 'rules'}</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <TouchableOpacity
          style={[styles.chip, selected === 'all' && styles.chipActive]}
          onPress={() => onSelect('all')}
        >
          <Text style={[styles.chipText, selected === 'all' && styles.chipTextActive]}>
            🕋 {t('etiquette.all_filter')}
          </Text>
        </TouchableOpacity>

        {ALL_CATEGORIES.map((cat) => {
          const label = ETIQUETTE_CATEGORY_LABELS[cat];
          const isActive = selected === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {label.emoji} {isAr ? label.ar : label.en}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBlock: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.goldAccent,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7,
  },
  countBadge: {
    backgroundColor: Colors.goldAccent + '22',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.goldAccent + '55',
    minWidth: 60,
  },
  countNum: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.goldAccent,
    lineHeight: 22,
  },
  countLabel: {
    fontSize: 10,
    color: Colors.white,
    opacity: 0.65,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    backgroundColor: Colors.white + '18',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: Colors.white + '30',
  },
  chipActive: {
    backgroundColor: Colors.goldAccent,
    borderColor: Colors.goldAccent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  chipTextActive: {
    color: Colors.brandGreen,
  },
});
