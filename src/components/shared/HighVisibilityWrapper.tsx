import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useUIStore } from '../../stores/uiStore';
import { Colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function HighVisibilityWrapper({ children, style }: Props) {
  const isHighVisibility = useUIStore((s) => s.isHighVisibility);

  return (
    <View
      style={[
        styles.base,
        isHighVisibility && styles.highVisibility,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
  },
  highVisibility: {
    backgroundColor: Colors.hvBackground,
  },
});
