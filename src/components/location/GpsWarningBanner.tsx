import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface Props {
  onLandmarkGuide: () => void;
}

export function GpsWarningBanner({ onLandmarkGuide }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{t('tracker.gps_warning')}</Text>
      <TouchableOpacity onPress={onLandmarkGuide} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>{t('tracker.landmark_guide')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E65100',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  text: { color: Colors.white, fontSize: 14, flex: 1 },
  button: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginLeft: Spacing.sm,
  },
  buttonText: { color: '#E65100', fontSize: 13, fontWeight: '700' },
});
