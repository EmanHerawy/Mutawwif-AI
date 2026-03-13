import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: object;
}

const PATTERN_CHARS = ['◆', '◇', '✦', '✧', '❖', '◈', '❋', '◉'];

function PatternRow({ offset }: { offset: number }) {
  return (
    <View style={styles.row}>
      {PATTERN_CHARS.map((char, i) => (
        <Text
          key={i}
          style={[
            styles.patternChar,
            { opacity: ((i + offset) % 3 === 0) ? 0.18 : 0.09 },
          ]}
        >
          {char}
        </Text>
      ))}
    </View>
  );
}

export function IslamicPatternBg({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Decorative geometric pattern — no images of any person */}
      <View style={styles.patternLayer} pointerEvents="none">
        {[0, 1, 2, 3, 4].map((row) => (
          <PatternRow key={row} offset={row} />
        ))}
      </View>
      {/* Top and bottom ornamental borders */}
      <View style={styles.borderTop} pointerEvents="none">
        {[...Array(12)].map((_, i) => (
          <Text key={i} style={styles.borderChar}>❖</Text>
        ))}
      </View>
      <View style={styles.borderBottom} pointerEvents="none">
        {[...Array(12)].map((_, i) => (
          <Text key={i} style={styles.borderChar}>❖</Text>
        ))}
      </View>
      <View style={styles.childrenLayer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.brandGreen,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  patternChar: {
    fontSize: 20,
    color: Colors.goldAccent,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldAccent + '44',
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.goldAccent + '44',
  },
  borderChar: {
    fontSize: 10,
    color: Colors.goldAccent,
    opacity: 0.5,
  },
  childrenLayer: {
    position: 'relative',
  },
});
