import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ProphetEntry, ProphetEntrySource } from '../../types/prophet.types';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface Props {
  entry: ProphetEntry;
  onPress: () => void;
}

const SOURCE_LABEL: Record<ProphetEntrySource, { ar: string; en: string }> = {
  bukhari:   { ar: 'البخاري',  en: 'Al-Bukhari' },
  muslim:    { ar: 'مسلم',     en: 'Muslim' },
  shamail:   { ar: 'الشمائل', en: 'Al-Shamail' },
  ibn_hisham:{ ar: 'ابن هشام', en: 'Ibn Hisham' },
  ibn_kathir:{ ar: 'ابن كثير', en: 'Ibn Kathir' },
};

export function ProphetEntryCard({ entry, onPress }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const title = isAr ? entry.titleAr : entry.titleEn;
  const text  = isAr ? entry.textAr  : entry.textEn;
  const sourceLabel = isAr
    ? SOURCE_LABEL[entry.source].ar
    : SOURCE_LABEL[entry.source].en;

  const preview =
    text.length > 80 ? text.slice(0, 80).trimEnd() + '…' : text;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.accentStrip} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, isAr && styles.rtl]}
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </View>
        <Text
          style={[styles.preview, isAr && styles.rtl]}
          numberOfLines={2}
        >
          {preview}
        </Text>
        <View style={styles.footer}>
          <View style={styles.sourcePill}>
            <Text style={styles.sourceText}>{sourceLabel}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  accentStrip: {
    width: 4,
    backgroundColor: Colors.goldAccent,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.brandGreen,
    lineHeight: 22,
  },
  chevron: {
    fontSize: 22,
    color: Colors.goldAccent,
    lineHeight: 24,
    marginTop: 1,
  },
  preview: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
    opacity: 0.75,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sourcePill: {
    backgroundColor: Colors.goldAccent + '22',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.goldAccent + '55',
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.goldAccent,
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
