import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { TouchTarget, Spacing } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  minHeight?: number;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  minHeight = TouchTarget.standard,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.base,
        { minHeight },
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.brandGreen} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Text` as keyof typeof styles], textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: Colors.brandGreen },
  secondary: { backgroundColor: Colors.transparent, borderWidth: 2, borderColor: Colors.brandGreen },
  danger: { backgroundColor: Colors.alertWarning },
  ghost: { backgroundColor: Colors.transparent },
  disabled: { opacity: 0.4 },
  label: { fontSize: 16, fontWeight: '600' },
  primaryText: { color: Colors.white },
  secondaryText: { color: Colors.brandGreen },
  dangerText: { color: Colors.white },
  ghostText: { color: Colors.brandGreen },
});
