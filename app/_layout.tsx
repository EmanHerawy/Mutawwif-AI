import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import i18n, { initI18n } from '../src/i18n/config';
import { usePersonaStore } from '../src/stores/personaStore';
import { useUIStore } from '../src/stores/uiStore';
import { useRitualStore } from '../src/stores/ritualStore';
import { recoveryService } from '../src/services/recoveryService';
import { gpsService } from '../src/services/gpsService';
import { RecoveryModal } from '../src/components/recovery/RecoveryModal';
import type { RitualCounterType } from '../src/types/ritual.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Bootstrap i18n once at module level with default language
initI18n('en');

// Register Zustand store-to-store subscriptions once at module level
recoveryService.init();

export default function RootLayout() {
  const persona = usePersonaStore((s) => s.persona);
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const counter = useRitualStore((s) => s.counter);
  const isActive = useRitualStore((s) => s.isActive);
  const markComplete = useRitualStore((s) => s.markComplete);
  const resetCounter = useRitualStore((s) => s.resetCounter);

  const router = useRouter();
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const lang = persona?.languageCode;
    if (lang) i18n.changeLanguage(lang);
  }, [persona?.languageCode]);

  // Start GPS on mount (opt-in; runs silently in background)
  useEffect(() => {
    gpsService.start().catch(() => {/* permission denied — fine, GPS is opt-in */});
    return () => gpsService.stop();
  }, []);

  // Show recovery modal if there's an incomplete ritual
  useEffect(() => {
    const state = recoveryService.getRecoveryState();
    if (state.hasIncompleteRitual) {
      setShowRecovery(true);
    }
  }, []);

  const hasIncompleteRitual =
    counter !== null &&
    counter.completedLaps > 0 &&
    counter.completedLaps < 7 &&
    isActive;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="tutorial/[step]" />
            </Stack>

            {hasIncompleteRitual && showRecovery && counter && (
              <RecoveryModal
                visible={showRecovery}
                ritual={counter.ritual as RitualCounterType}
                completedLaps={counter.completedLaps}
                lastSavedAt={counter.lastSavedAt as Date | string | null}
                onResume={() => {
                  setShowRecovery(false);
                  router.push('/(tabs)/tracker');
                }}
                onStartOver={() => {
                  resetCounter();
                  setShowRecovery(false);
                }}
                onMarkComplete={() => {
                  markComplete();
                  setShowRecovery(false);
                }}
              />
            )}
          </I18nextProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
