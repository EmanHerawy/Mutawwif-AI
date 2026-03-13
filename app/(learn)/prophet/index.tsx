import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { PROPHET_ENTRIES } from '../../../src/data/prophet-entries';
import { IslamicPatternBg } from '../../../src/components/prophet/IslamicPatternBg';
import type { ProphetCategory } from '../../../src/types/prophet.types';
import { Colors } from '../../../src/theme/colors';
import { Spacing } from '../../../src/theme/spacing';

interface CategoryMeta {
  category: ProphetCategory;
  icon: string;
}

const CATEGORIES: CategoryMeta[] = [
  { category: 'physical_description', icon: '✦' },
  { category: 'character',            icon: '◈' },
  { category: 'daily_life',           icon: '◇' },
  { category: 'worship',              icon: '❖' },
  { category: 'mercy',                icon: '◆' },
  { category: 'humor',                icon: '✧' },
  { category: 'family',               icon: '◉' },
  { category: 'names_titles',         icon: '❋' },
];

export default function ProphetIndexScreen() {
  const { t } = useTranslation();

  const countByCategory = useMemo(() => {
    const map: Partial<Record<ProphetCategory, number>> = {};
    for (const entry of PROPHET_ENTRIES) {
      map[entry.category] = (map[entry.category] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: `${t('prophet.title')} ﷺ`,
          headerStyle: { backgroundColor: Colors.parchmentBg },
          headerTintColor: Colors.brandGreen,
          headerTitleStyle: { fontWeight: '700', color: Colors.brandGreen },
        }}
      />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.category}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<ProphetHeader />}
        renderItem={({ item }) => (
          <CategoryCard
            meta={item}
            count={countByCategory[item.category] ?? 0}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function ProphetHeader() {
  const { t } = useTranslation();
  return (
    <IslamicPatternBg style={styles.headerBanner}>
      <View style={styles.headerInner}>
        <Text style={styles.headerTitle}>{t('prophet.title')}</Text>
        <Text style={styles.headerSallallahu}>ﷺ</Text>
        <Text style={styles.headerSubtitle}>{t('prophet.subtitle')}</Text>
        <View style={styles.headerDivider} />
        <Text style={styles.headerNote}>✦  {t('prophet.ai_note')}  ✦</Text>
      </View>
    </IslamicPatternBg>
  );
}

interface CardProps {
  meta: CategoryMeta;
  count: number;
}

function CategoryCard({ meta, count }: CardProps) {
  const { t } = useTranslation();
  const label = t(`prophet.category.${meta.category}`);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: '/(learn)/prophet/[category]',
          params: { category: meta.category },
        })
      }
    >
      <Text style={styles.cardIcon}>{meta.icon}</Text>
      <Text style={styles.cardPrimary} numberOfLines={2}>{label}</Text>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  list: {
    paddingBottom: 40,
  },
  headerBanner: {
    marginBottom: Spacing.md,
  },
  headerInner: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  headerSallallahu: {
    fontSize: 32,
    color: Colors.goldAccent,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.85,
    textAlign: 'center',
  },
  headerDivider: {
    width: 60,
    height: 1,
    backgroundColor: Colors.goldAccent,
    opacity: 0.5,
    marginVertical: Spacing.xs,
  },
  headerNote: {
    fontSize: 11,
    color: Colors.goldAccent,
    textAlign: 'center',
    opacity: 0.9,
  },
  row: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 3,
    borderTopColor: Colors.goldAccent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 130,
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 28,
    color: Colors.goldAccent,
  },
  cardPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.brandGreen,
    textAlign: 'center',
  },
  countBadge: {
    marginTop: 4,
    backgroundColor: Colors.brandGreen + '18',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandGreen,
  },
});
