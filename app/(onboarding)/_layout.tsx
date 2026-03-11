import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="persona" />
      <Stack.Screen name="origin" />
      <Stack.Screen name="identity" />
      <Stack.Screen name="miqat-info" />
    </Stack>
  );
}
