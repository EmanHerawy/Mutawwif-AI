import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useGateStore } from '../../../src/stores/gateStore';
import { GateCard } from '../../../src/components/visit/GateCard';
import { Colors } from '../../../src/theme/colors';
import type { GateInfo } from '../../../src/types/gate.types';

type Filter = 'all' | 'accessible';

export default function NabawiGatesScreen() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const nabawiGates = useGateStore((s) => s.nabawiGates);
  const nabawiDataSource = useGateStore((s) => s.nabawiDataSource);
  const loading = useGateStore((s) => s.loading);
  const fetchNabawi = useGateStore((s) => s.fetchNabawi);

  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (nabawiGates.length === 0) {
      fetchNabawi();
    }
  }, []);

  const sorted: GateInfo[] = [...nabawiGates].sort((a, b) => {
    if (a.accessible === b.accessible) return 0;
    return a.accessible ? -1 : 1;
  });

  const displayed = filter === 'accessible'
    ? sorted.filter((g) => g.accessible)
    : sorted;

  return (
    <>
      <Stack.Screen options={{ title: isAr ? 'البوابات' : 'Gates' }} />
      <View style={styles.container}>
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              {isAr ? 'الكل' : 'All'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filter === 'accessible' && styles.filterBtnActive]}
            onPress={() => setFilter('accessible')}
          >
            <Text style={[styles.filterText, filter === 'accessible' && styles.filterTextActive]}>
              {isAr ? 'ذوو الاحتياجات' : 'Accessible'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.brandGreen} style={styles.loader} />
        ) : (
          <FlatList
            data={displayed}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GateCard item={item} dataSource={nabawiDataSource ?? 'mock'} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  filterBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.parchmentBg,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.brandGreen,
  },
  filterBtnActive: {
    backgroundColor: Colors.brandGreen,
  },
  filterText: {
    fontSize: 13,
    color: Colors.brandGreen,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  loader: {
    marginTop: 60,
  },
  list: {
    paddingVertical: 10,
  },
});
