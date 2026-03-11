import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RitualCounterModel, LapRecord, RitualCounterType, RitualStep } from '../types/ritual.types';
import type { HaramZone } from '../types/location.types';

interface RitualState {
  counter: RitualCounterModel | null;
  currentStepId: string | null;
  steps: RitualStep[];
  isActive: boolean;

  // Counter actions
  startCounter: (ritual: RitualCounterType) => void;
  incrementLap: (zone: HaramZone, gpsValidated: boolean) => void;
  pauseCounter: () => void;
  resumeCounter: () => void;
  resetCounter: () => void;
  markComplete: () => void;
  resumeFrom: (savedCounter: RitualCounterModel) => void;

  // Step actions
  setCurrentStep: (stepId: string) => void;
  setSteps: (steps: RitualStep[]) => void;

  // Zone change handler (called by Zustand subscribe — NOT useEffect)
  onZoneChange: (zone: HaramZone) => void;
}

const createInitialCounter = (ritual: RitualCounterType): RitualCounterModel => ({
  ritual,
  totalLaps: 7,
  completedLaps: 0,
  currentLap: 1,
  isPaused: false,
  pausedAt: null,
  lapHistory: [],
  startDirectionValidated: false,
  lastSavedAt: new Date(),
  isActive: true,
});

export const useRitualStore = create<RitualState>()(
  persist(
    immer((set, get) => ({
      counter: null,
      currentStepId: null,
      steps: [],
      isActive: false,

      startCounter: (ritual) =>
        set((state) => {
          state.counter = createInitialCounter(ritual);
          state.isActive = true;
        }),

      incrementLap: (zone, gpsValidated) =>
        set((state) => {
          if (!state.counter || !state.isActive) return;

          const now = new Date();
          const lapRecord: LapRecord = {
            lapNumber: state.counter.currentLap,
            startTime: state.counter.lapHistory.at(-1)?.endTime ?? now,
            endTime: now,
            durationMs: null,
            zone,
            gpsValidated,
          };

          if (lapRecord.startTime && lapRecord.endTime) {
            lapRecord.durationMs =
              lapRecord.endTime.getTime() - lapRecord.startTime.getTime();
          }

          state.counter.lapHistory.push(lapRecord);
          state.counter.completedLaps += 1;
          state.counter.currentLap = state.counter.completedLaps + 1;
          state.counter.lastSavedAt = now;

          if (state.counter.completedLaps >= 7) {
            state.counter.isActive = false;
            state.isActive = false;
          }
        }),

      pauseCounter: () =>
        set((state) => {
          if (!state.counter) return;
          state.counter.isPaused = true;
          state.counter.pausedAt = new Date();
          state.counter.lastSavedAt = new Date();
        }),

      resumeCounter: () =>
        set((state) => {
          if (!state.counter) return;
          state.counter.isPaused = false;
          state.counter.pausedAt = null;
          state.counter.lastSavedAt = new Date();
        }),

      resetCounter: () =>
        set((state) => {
          state.counter = null;
          state.isActive = false;
        }),

      markComplete: () =>
        set((state) => {
          if (!state.counter) return;
          state.counter.completedLaps = 7;
          state.counter.isActive = false;
          state.isActive = false;
          state.counter.lastSavedAt = new Date();
        }),

      resumeFrom: (savedCounter) =>
        set((state) => {
          state.counter = savedCounter;
          state.isActive = savedCounter.isActive;
        }),

      setCurrentStep: (stepId) =>
        set((state) => {
          state.currentStepId = stepId;
        }),

      setSteps: (steps) =>
        set((state) => {
          state.steps = steps;
        }),

      onZoneChange: (_zone: HaramZone) => {
        // Zone-based lap validation logic goes here
        // Called by locationStore.subscribe() — NOT useEffect
        const { counter, isActive } = get();
        if (!counter || !isActive) return;
        // Future: auto-validate lap position based on zone
      },
    })),
    {
      name: 'ritual-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        counter: state.counter,
        currentStepId: state.currentStepId,
        isActive: state.isActive,
      }),
    }
  )
);
