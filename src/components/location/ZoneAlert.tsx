import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface Props {
  zone: string | null;
  onLandmarkGuide: () => void;
}

export function ZoneAlert({ zone, onLandmarkGuide }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('tracker.zone_alert')}</Text>
      {zone && <Text style={styles.zone}>Expected: {zone}</Text>}
      <TouchableOpacity onPress={onLandmarkGuide} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>{t('tracker.landmark_guide')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: Colors.alertWarning,
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: 8,
  },
  text: { color: Colors.alertWarning, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  zone: { color: Colors.textPrimary, fontSize: 13, marginBottom: Spacing.sm },
  button: {
    backgroundColor: Colors.alertWarning,
    borderRadius: 6,
    padding: Spacing.sm,
    alignSelf: 'flex-start',
  },
  buttonText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
});
