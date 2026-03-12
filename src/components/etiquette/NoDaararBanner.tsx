import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export function NoDaararBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.arabic}>لا ضرر ولا ضرار</Text>
      <Text style={styles.english}>No harm and no reciprocation of harm</Text>
      <Text style={styles.source}>رواه ابن ماجة عن ابن عباس رضي الله عنه</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  arabic: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.goldAccent,
    textAlign: 'center',
    marginBottom: 4,
  },
  english: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 6,
  },
  source: {
    fontSize: 11,
    color: Colors.goldAccent,
    opacity: 0.7,
    textAlign: 'center',
  },
});
