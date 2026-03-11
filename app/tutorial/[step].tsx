import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function TutorialStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorial — Step {step}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchmentBg, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, color: Colors.brandGreen },
});
