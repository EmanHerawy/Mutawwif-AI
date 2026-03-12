import { ImageBackground, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';

const BG = require('../../assets/background.png');

export default function ScreenBackground({ children }: { children: ReactNode }) {
  return (
    <ImageBackground source={BG} style={styles.fill} imageStyle={styles.pattern}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  pattern: { opacity: 0.18, resizeMode: 'repeat' },
});
