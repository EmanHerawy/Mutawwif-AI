import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RitualCounterModel, LapRecord, RitualCounterType, RitualStep, TrackerPrefs } from '../types/ritual.types';
import type { HaramZone } from '../types/location.types';

// --- Ephemeral auto-detect state (not persisted) ---
let lastSaiZone: 'safa_platform' | 'marwa_platform' | null = null;
let lastTawafCheckpointMs = 0;
const TAWAF_DEBOUNCE_MS = 60_000; // 60 s between auto-increments

interface RitualState {
  counter: RitualCounterModel | null;
  currentStepId: string | null;
  steps: RitualStep[];
  isActive: boolean;
  trackerPrefs: TrackerPrefs;
  currentLapSteps: number;

  // Counter actions
  startCounter: (ritual: RitualCounterType) => void;
  incrementLap: (zone: HaramZone, gpsValidated: boolean, autoDetected?: boolean) => void;
  pauseCounter: () => void;
  resumeCounter: () => void;
  resetCounter: () => void;
  markComplete: () => void;
  resumeFrom: (savedCounter: RitualCounterModel) => void;

  // Tracker prefs
  updateTrackerPrefs: (prefs: Partial<TrackerPrefs>) => void;

  // Step counting
  addSteps: (steps: number) => void;

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
      trackerPrefs: { autoDetectLaps: false, trackSteps: false, trackTime: false },
      currentLapSteps: 0,

      startCounter: (ritual) => {
        lastSaiZone = null;
        lastTawafCheckpointMs = 0;
        set((state) => {
          state.counter = createInitialCounter(ritual);
          state.isActive = true;
          state.currentLapSteps = 0;
        });
      },

      incrementLap: (zone, gpsValidated, autoDetected = false) =>
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
            steps: state.trackerPrefs.trackSteps ? state.currentLapSteps : undefined,
            autoDetected: autoDetected || undefined,
          };

          if (lapRecord.startTime && lapRecord.endTime) {
            lapRecord.durationMs =
              lapRecord.endTime.getTime() - lapRecord.startTime.getTime();
          }

          state.counter.lapHistory.push(lapRecord);
          state.counter.completedLaps += 1;
          state.counter.currentLap = state.counter.completedLaps + 1;
          state.counter.lastSavedAt = now;
          state.currentLapSteps = 0;

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

      resetCounter: () => {
        lastSaiZone = null;
        lastTawafCheckpointMs = 0;
        set((state) => {
          state.counter = null;
          state.isActive = false;
          state.currentLapSteps = 0;
        });
      },

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

      updateTrackerPrefs: (prefs) =>
        set((state) => {
          Object.assign(state.trackerPrefs, prefs);
        }),

      addSteps: (steps) =>
        set((state) => {
          state.currentLapSteps += steps;
        }),

      setCurrentStep: (stepId) =>
        set((state) => {
          state.currentStepId = stepId;
        }),

      setSteps: (steps) =>
        set((state) => {
          state.steps = steps;
        }),

      onZoneChange: (zone: HaramZone) => {
        // Called by locationStore.subscribe() — NOT useEffect
        const { counter, isActive, trackerPrefs, incrementLap } = get();
        if (!counter || !isActive || !trackerPrefs.autoDetectLaps) return;
        if (counter.isPaused || counter.completedLaps >= 7) return;

        if (counter.ritual === 'tawaf' && zone === 'black_stone_checkpoint') {
          const now = Date.now();
          if (now - lastTawafCheckpointMs > TAWAF_DEBOUNCE_MS) {
            lastTawafCheckpointMs = now;
            incrementLap(zone, true, true);
          }
          return;
        }

        if (counter.ritual === 'sai') {
          if (zone === 'safa_platform' || zone === 'marwa_platform') {
            if (lastSaiZone === null) {
              // First detection — record starting platform, no lap increment
              lastSaiZone = zone;
            } else if (zone !== lastSaiZone) {
              // Crossed to the other platform — lap complete
              lastSaiZone = zone;
              incrementLap(zone, true, true);
            }
          }
        }
      },
    })),
    {
      name: 'ritual-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        counter: state.counter,
        currentStepId: state.currentStepId,
        isActive: state.isActive,
        steps: state.steps,
        trackerPrefs: state.trackerPrefs,
      }),
    }
  )
);
