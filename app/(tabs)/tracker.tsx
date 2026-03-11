import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../src/theme/colors';

export default function TrackerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ritual Tracker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchmentBg, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, color: Colors.brandGreen },
});
