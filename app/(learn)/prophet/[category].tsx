import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { PROPHET_ENTRIES } from '../../../src/data/prophet-entries';
import { ProphetEntryCard } from '../../../src/components/prophet/ProphetEntryCard';
import type { ProphetCategory, ProphetEntry } from '../../../src/types/prophet.types';
import { Colors } from '../../../src/theme/colors';
import { Spacing } from '../../../src/theme/spacing';

const CATEGORY_LABELS: Record<ProphetCategory, { ar: string; en: string; icon: string }> = {
  physical_description: { ar: 'صفته الجسدية',   en: 'His Appearance',  icon: '✦' },
  character:            { ar: 'أخلاقه',          en: 'His Character',   icon: '◈' },
  daily_life:           { ar: 'حياته اليومية',   en: 'Daily Life',      icon: '◇' },
  worship:              { ar: 'عبادته',          en: 'His Worship',     icon: '❖' },
  mercy:                { ar: 'رحمته',           en: 'His Mercy',       icon: '◆' },
  humor:                { ar: 'تواضعه',          en: 'His Humility',    icon: '✧' },
  family:               { ar: 'أسرته',           en: 'His Family',      icon: '◉' },
  names_titles:         { ar: 'أسماؤه وألقابه',  en: 'Names & Titles',  icon: '❋' },
};

export default function ProphetCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const catKey = category as ProphetCategory;
  const label = CATEGORY_LABELS[catKey] ?? { ar: '', en: category ?? '', icon: '◆' };

  const entries = useMemo(
    () => PROPHET_ENTRIES.filter((e) => e.category === catKey),
    [catKey],
  );

  const screenTitle = isAr ? label.ar : label.en;

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: screenTitle,
          headerStyle: { backgroundColor: Colors.parchmentBg },
          headerTintColor: Colors.brandGreen,
          headerTitleStyle: { fontWeight: '700', color: Colors.brandGreen },
          headerBackTitle: '',
        }}
      />
      <FlatList
        data={entries}
        keyExtractor={(item: ProphetEntry) => item.id}
        renderItem={({ item }: { item: ProphetEntry }) => (
          <ProphetEntryCard
            entry={item}
            onPress={() =>
              router.push({
                pathname: '/(learn)/prophet/[entry]',
                params: { entry: item.id },
              })
            }
          />
        )}
        ListHeaderComponent={
          <CategoryHeader
            icon={label.icon}
            titleAr={label.ar}
            titleEn={label.en}
            count={entries.length}
            isAr={isAr}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

interface HeaderProps {
  icon: string;
  titleAr: string;
  titleEn: string;
  count: number;
  isAr: boolean;
}

function CategoryHeader({ icon, titleAr, titleEn, count, isAr }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerIcon}>{icon}</Text>
      <View style={styles.headerTextBlock}>
        <Text style={[styles.headerAr, isAr && styles.rtl]}>{titleAr}</Text>
        <Text style={styles.headerEn}>{titleEn}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAccent + '33',
  },
  headerIcon: {
    fontSize: 28,
    color: Colors.goldAccent,
  },
  headerTextBlock: {
    flex: 1,
    gap: 2,
  },
  headerAr: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.brandGreen,
  },
  headerEn: {
    fontSize: 13,
    color: Colors.textPrimary,
    opacity: 0.6,
  },
  countBadge: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
