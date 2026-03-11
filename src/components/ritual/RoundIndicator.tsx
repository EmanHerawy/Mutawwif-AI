import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface Props {
  completedLaps: number;
  totalLaps: number;
  ritual: 'tawaf' | 'sai';
}

export function RoundIndicator({ completedLaps, totalLaps, ritual }: Props) {
  const { t } = useTranslation();
  const isHV = useUIStore((s) => s.isHighVisibility);
  const currentLap = completedLaps + 1;

  return (
    <View style={[styles.container, isHV && styles.containerHV]}>
      <Text style={[styles.ritualLabel, isHV && styles.ritualLabelHV]}>
        {t(`tracker.${ritual}`)}
      </Text>
      <Text style={[styles.lapNumber, isHV && styles.lapNumberHV]}>
        {currentLap <= totalLaps ? currentLap : totalLaps}
      </Text>
      <Text style={[styles.lapOf, isHV && styles.lapOfHV]}>
        {t('tracker.of')} {totalLaps}
      </Text>
      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: totalLaps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < completedLaps && (isHV ? styles.dotCompletedHV : styles.dotCompleted),
              isHV && styles.dotHV,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.parchmentBg,
  },
  containerHV: { backgroundColor: Colors.hvBackground },
  ritualLabel: {
    fontSize: 20,
    color: Colors.brandGreen,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  ritualLabelHV: { color: Colors.hvTextPrimary, fontSize: 20 },
  lapNumber: {
    fontSize: 80,
    fontWeight: '700',
    color: Colors.goldAccent,
    lineHeight: 88,
  },
  lapNumberHV: { fontSize: 96, color: Colors.hvLapNumber },
  lapOf: { fontSize: 20, color: Colors.textPrimary, marginTop: -8 },
  lapOfHV: { color: Colors.hvTextPrimary, fontSize: 20 },
  dots: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D0C8B8',
  },
  dotHV: { backgroundColor: '#444' },
  dotCompleted: { backgroundColor: Colors.goldAccent },
  dotCompletedHV: { backgroundColor: Colors.hvLapNumber },
});
