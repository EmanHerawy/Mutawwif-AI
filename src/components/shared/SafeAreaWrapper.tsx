import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export function SafeAreaWrapper({ children, style, backgroundColor }: Props) {
  return (
    <SafeAreaView
      style={[styles.base, { backgroundColor: backgroundColor ?? Colors.parchmentBg }, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
});
