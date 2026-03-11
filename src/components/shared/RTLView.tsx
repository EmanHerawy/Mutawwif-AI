import React from 'react';
import { View, ViewStyle, I18nManager } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function RTLView({ children, style }: Props) {
  return (
    <View
      style={[
        style,
        I18nManager.isRTL && { flexDirection: 'row-reverse' },
      ]}
    >
      {children}
    </View>
  );
}
