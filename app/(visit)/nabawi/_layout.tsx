import { Stack } from 'expo-router';
import { Colors } from '../../../src/theme/colors';

export default function NabawiLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.brandGreen },
        headerTintColor: Colors.goldAccent,
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: '',
      }}
    />
  );
}
