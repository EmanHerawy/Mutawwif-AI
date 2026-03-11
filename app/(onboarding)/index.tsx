import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function LanguageScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر لغتك / Choose Language</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchmentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.brandGreen,
    fontWeight: 'bold',
  },
});
