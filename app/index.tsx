import { Redirect } from 'expo-router';
import { usePersonaStore } from '../src/stores/personaStore';

export default function Index() {
  const isOnboardingComplete = usePersonaStore((s) => s.isOnboardingComplete);

  if (!isOnboardingComplete) {
    return <Redirect href="/(onboarding)/" />;
  }
  return <Redirect href="/(tabs)/" />;
}
