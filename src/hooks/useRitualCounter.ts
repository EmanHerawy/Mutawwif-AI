import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useRitualStore } from '../stores/ritualStore';
import { useLocationStore } from '../stores/locationStore';
import type { RitualCounterType } from '../types/ritual.types';

export function useRitualCounter() {
  const counter = useRitualStore((s) => s.counter);
  const isActive = useRitualStore((s) => s.isActive);
  const currentStepId = useRitualStore((s) => s.currentStepId);
  const { startCounter, incrementLap, pauseCounter, resumeCounter, resetCounter } =
    useRitualStore.getState();

  const currentZone = useLocationStore((s) => s.currentZone);

  const handleIncrement = useCallback(async () => {
    if (!counter || !isActive || counter.isPaused) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    incrementLap(currentZone, false); // gpsValidated set by geofence watcher
  }, [counter, isActive, currentZone, incrementLap]);

  const handleStart = useCallback(
    async (ritual: RitualCounterType) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      startCounter(ritual);
    },
    [startCounter]
  );

  const isComplete = counter?.completedLaps === 7;
  const lapsRemaining = counter ? 7 - counter.completedLaps : 7;

  return {
    counter,
    isActive,
    isComplete,
    lapsRemaining,
    currentStepId,
    handleIncrement,
    handleStart,
    pauseCounter,
    resumeCounter,
    resetCounter,
  };
}
