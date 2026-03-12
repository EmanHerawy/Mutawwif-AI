import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { EtiquetteCategory } from '../../types/etiquette.types';
import { ETIQUETTE_CATEGORY_LABELS } from '../../data/etiquette';
import { Colors } from '../../theme/colors';

interface Props {
  selected: EtiquetteCategory | 'all';
  onSelect: (cat: EtiquetteCategory | 'all') => void;
  gender: 'male' | 'female';
}

const ALL_CATEGORIES: EtiquetteCategory[] = [
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

export function EtiquetteFilterBar({ selected, onSelect, gender }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const allLabel = isAr ? 'الكل' : 'All';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, selected === 'all' && styles.chipActive]}
        onPress={() => onSelect('all')}
      >
        <Text style={[styles.chipText, selected === 'all' && styles.chipTextActive]}>
          {allLabel}
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
              {isAr ? label.ar : label.en}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '44',
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.brandGreen,
    borderColor: Colors.brandGreen,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.brandGreen,
  },
  chipTextActive: {
    color: Colors.white,
  },
});
