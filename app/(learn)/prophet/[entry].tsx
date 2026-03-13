import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PROPHET_ENTRIES } from '../../../src/data/prophet-entries';
import type { ProphetEntrySource } from '../../../src/types/prophet.types';
import { Colors } from '../../../src/theme/colors';
import { Spacing } from '../../../src/theme/spacing';

const SOURCE_LABEL: Record<ProphetEntrySource, { ar: string; en: string }> = {
  bukhari:    { ar: 'البخاري',  en: 'Al-Bukhari' },
  muslim:     { ar: 'مسلم',    en: 'Muslim' },
  shamail:    { ar: 'الشمائل', en: 'Al-Shamail' },
  ibn_hisham: { ar: 'ابن هشام', en: 'Ibn Hisham' },
  ibn_kathir: { ar: 'ابن كثير', en: 'Ibn Kathir' },
};

export default function ProphetEntryScreen() {
  const { entry: entryParam } = useLocalSearchParams<{ entry: string | string[] }>();
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const id = Array.isArray(entryParam) ? entryParam[0] : entryParam;
  const entry = PROPHET_ENTRIES.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: '—' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Entry not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const screenTitle = isAr ? entry.titleAr : entry.titleEn;
  const sourceLabel = isAr
    ? SOURCE_LABEL[entry.source].ar
    : SOURCE_LABEL[entry.source].en;
  const citation = isAr ? entry.citationAr : entry.citationEn;

  const handleShare = () => {
    const shareText = isAr
      ? `${entry.titleAr}\n\n${entry.textAr}\n\n— ${entry.citationAr}`
      : `${entry.titleEn}\n\n${entry.textEn}\n\n— ${entry.citationEn}`;

    Share.share({ message: shareText });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: screenTitle,
          headerStyle: { backgroundColor: Colors.parchmentBg },
          headerTintColor: Colors.brandGreen,
          headerTitleStyle: { fontWeight: '700', color: Colors.brandGreen },
          headerBackTitle: '',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
              <Text style={styles.shareBtnText}>⬆</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Verified badge */}
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>
            ✓ {isAr ? 'رواية موثَّقة' : 'Verified Narration'}
          </Text>
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.titleAr, styles.rtl]}>{entry.titleAr}</Text>
          <Text style={styles.titleEn}>{entry.titleEn}</Text>
        </View>

        {/* Arabic text — primary */}
        <View style={styles.textCard}>
          <View style={styles.textCardAccent} />
          <Text style={[styles.arabicText, styles.rtl]}>{entry.textAr}</Text>
        </View>

        {/* English text */}
        <View style={styles.englishCard}>
          <Text style={styles.englishText}>{entry.textEn}</Text>
        </View>

        {/* Citation block */}
        <View style={styles.citationBlock}>
          <View style={styles.citationHeader}>
            <Text style={styles.citationIcon}>◆</Text>
            <Text style={styles.citationLabel}>
              {isAr ? 'المصدر' : 'Source'}
            </Text>
            <View style={styles.sourcePill}>
              <Text style={styles.sourcePillText}>{sourceLabel}</Text>
            </View>
          </View>
          <Text style={[styles.citationText, isAr && styles.rtl]}>
            {citation}
          </Text>
        </View>

        {/* Share button */}
        <TouchableOpacity style={styles.shareBlock} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareBlockText}>
            {isAr ? '⬆  مشاركة النص والمصدر' : '⬆  Share Text & Citation'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textPrimary,
    opacity: 0.5,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 60,
    gap: Spacing.md,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandGreen + '18',
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.brandGreen + '44',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandGreen,
  },
  titleBlock: {
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: Colors.goldAccent,
    paddingLeft: Spacing.sm,
  },
  titleAr: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.brandGreen,
    lineHeight: 30,
  },
  titleEn: {
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.65,
  },
  textCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  textCardAccent: {
    width: 4,
    backgroundColor: Colors.goldAccent,
  },
  arabicText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 32,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontWeight: '500',
  },
  englishCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  englishText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textPrimary,
    opacity: 0.85,
  },
  citationBlock: {
    backgroundColor: Colors.brandGreen + '0D',
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.brandGreen + '22',
  },
  citationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  citationIcon: {
    fontSize: 12,
    color: Colors.goldAccent,
  },
  citationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandGreen,
    flex: 1,
  },
  sourcePill: {
    backgroundColor: Colors.goldAccent + '22',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.goldAccent + '55',
  },
  sourcePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.goldAccent,
  },
  citationText: {
    fontSize: 13,
    color: Colors.brandGreen,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  shareBlock: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  shareBlockText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  shareBtn: {
    paddingHorizontal: Spacing.sm,
  },
  shareBtnText: {
    fontSize: 18,
    color: Colors.brandGreen,
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
