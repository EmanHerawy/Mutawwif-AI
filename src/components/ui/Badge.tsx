import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

type BadgeVariant = 'verified' | 'partial' | 'disclaimer' | 'warning';

interface Props {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'verified', style }: Props) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  verified: { backgroundColor: '#E8F5E9' },
  partial: { backgroundColor: '#FFF8E1' },
  disclaimer: { backgroundColor: '#FBE9E7' },
  warning: { backgroundColor: Colors.alertWarning },
  text: { fontSize: 12, fontWeight: '600' },
  verifiedText: { color: Colors.brandGreen },
  partialText: { color: '#F57F17' },
  disclaimerText: { color: Colors.alertWarning },
  warningText: { color: Colors.white },
});
