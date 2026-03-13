import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { PROPHET_ENTRIES } from '../../../../src/data/prophet-entries';
import { ProphetEntryCard } from '../../../../src/components/prophet/ProphetEntryCard';
import type { ProphetCategory, ProphetEntry } from '../../../../src/types/prophet.types';
import { Colors } from '../../../../src/theme/colors';
import { Spacing } from '../../../../src/theme/spacing';

const CATEGORY_ICONS: Record<ProphetCategory, string> = {
  physical_description: '✦',
  character:            '◈',
  daily_life:           '◇',
  worship:              '❖',
  mercy:                '◆',
  humor:                '✧',
  family:               '◉',
  names_titles:         '❋',
};

export default function ProphetCategoryScreen() {
  const { category: categoryParam } = useLocalSearchParams<{ category: string | string[] }>();
  const category = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const { t } = useTranslation();

  const catKey = category as ProphetCategory;
  const icon = CATEGORY_ICONS[catKey] ?? '◆';
  const label = t(`prophet.category.${catKey}`, { defaultValue: catKey });

  const entries = useMemo(
    () => PROPHET_ENTRIES.filter((e) => e.category === catKey),
    [catKey],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          title: label,
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
                pathname: '/(learn)/prophet/[category]/[entry]',
                params: { category: catKey, entry: item.id },
              })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerIcon}>{icon}</Text>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>{label}</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{entries.length}</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAccent + '33',
  },
  headerIcon: { fontSize: 28, color: Colors.goldAccent },
  headerTextBlock: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.brandGreen },
  countBadge: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { fontSize: 13, fontWeight: '700', color: Colors.white },
});
