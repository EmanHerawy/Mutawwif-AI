import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import type { GateInfo, GateDataSource } from '../../types/gate.types';

const STATUS_COLORS: Record<string, string> = {
  open: '#22C55E',
  crowded: '#F59E0B',
  full: '#EF4444',
  closed: '#6B7280',
};

interface Props {
  item: GateInfo;
  dataSource: GateDataSource;
}

export function GateCard({ item, dataSource }: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const statusLabel = isAr
    ? { open: 'مفتوح', crowded: 'مزدحم', full: 'ممتلئ', closed: 'مغلق' }[item.status]
    : { open: 'Open', crowded: 'Crowded', full: 'Full', closed: 'Closed' }[item.status];

  const wingLabelAr: Record<string, string> = {
    north: 'شمال',
    south: 'جنوب',
    east: 'شرق',
    west: 'غرب',
    northeast: 'شمال شرقي',
    northwest: 'شمال غربي',
    southeast: 'جنوب شرقي',
    southwest: 'جنوب غربي',
  };

  const wingLabelEn: Record<string, string> = {
    north: 'North',
    south: 'South',
    east: 'East',
    west: 'West',
    northeast: 'Northeast',
    northwest: 'Northwest',
    southeast: 'Southeast',
    southwest: 'Southwest',
  };

  const wingLabel = isAr ? wingLabelAr[item.wing] : wingLabelEn[item.wing];

  const dataSourceBadge =
    dataSource === 'live'
      ? '🟢 Live'
      : dataSource === 'cache'
      ? '🟡 Cached'
      : '⚪ Mock / Offline';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={[styles.statusBar, { backgroundColor: STATUS_COLORS[item.status] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameBlock}>
            <Text style={styles.nameAr}>{item.nameAr}</Text>
            <Text style={styles.nameEn}>{item.nameEn}</Text>
          </View>
          <View style={styles.statusBlock}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
            <Text style={[styles.statusLabel, { color: STATUS_COLORS[item.status] }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.wing}>{wingLabel}</Text>
          {item.number !== undefined && (
            <Text style={styles.number}>
              {isAr ? `بوابة ${item.number}` : `Gate ${item.number}`}
            </Text>
          )}
          {item.accessible && (
            <FontAwesome5 name="wheelchair" size={14} color={Colors.brandGreen} style={styles.wheelchair} />
          )}
        </View>

        {item.notes !== undefined && (
          <Text style={styles.notes}>{item.notes}</Text>
        )}

        <Text style={styles.dataSourceBadge}>{dataSourceBadge}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  nameBlock: {
    flex: 1,
    marginRight: 8,
  },
  nameAr: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },
  nameEn: {
    fontSize: 13,
    color: Colors.textPrimary,
    opacity: 0.7,
    marginTop: 2,
  },
  statusBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  wing: {
    fontSize: 12,
    color: Colors.textPrimary,
    opacity: 0.6,
    backgroundColor: Colors.parchmentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  number: {
    fontSize: 12,
    color: Colors.textPrimary,
    opacity: 0.6,
  },
  wheelchair: {
    marginLeft: 2,
  },
  notes: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.55,
    marginTop: 4,
    fontStyle: 'italic',
  },
  dataSourceBadge: {
    marginTop: 6,
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.5,
  },
});
