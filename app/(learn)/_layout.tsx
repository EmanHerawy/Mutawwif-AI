import { Stack } from 'expo-router';
import { Colors } from '../../src/theme/colors';

export default function LearnLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.parchmentBg },
        headerTintColor: Colors.brandGreen,
        headerTitleStyle: { fontWeight: '700', color: Colors.brandGreen },
        headerBackTitle: '',
        contentStyle: { backgroundColor: Colors.parchmentBg },
      }}
    />
  );
}
