import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GPSReadingModel, HaramZone, IhramState, MiqatName, MiqatStatus, Coordinates } from '../types/location.types';

interface LocationState {
  // GPS
  latestReading: GPSReadingModel | null;
  filteredCoords: Coordinates | null;
  confidence: number;
  isManualMode: boolean;
  showLandmarkGuide: boolean;
  consecutiveReadings: Record<string, number>;

  // Zone
  currentZone: HaramZone;

  // Miqat
  miqatAssignment: MiqatName | null;
  miqatStatus: MiqatStatus;
  alreadyCrossed: boolean;
  retroactiveConfirmed: boolean;

  // Ihram
  ihramState: IhramState;

  // Actions
  updateGPS: (reading: GPSReadingModel) => void;
  setCurrentZone: (zone: HaramZone) => void;
  setMiqatAssignment: (miqat: MiqatName) => void;
  setMiqatStatus: (status: MiqatStatus) => void;
  setAlreadyCrossed: (value: boolean) => void;
  setIhramState: (state: IhramState) => void;
  setRetroactiveConfirmed: (value: boolean) => void;
  setManualMode: (enabled: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    immer((set) => ({
      latestReading: null,
      filteredCoords: null,
      confidence: 0,
      isManualMode: false,
      showLandmarkGuide: false,
      consecutiveReadings: {},
      currentZone: null,
      miqatAssignment: null,
      miqatStatus: 'not_assigned',
      alreadyCrossed: false,
      retroactiveConfirmed: false,
      ihramState: 'not_worn',

      updateGPS: (reading) =>
        set((state) => {
          state.latestReading = reading;
          state.filteredCoords = reading.filtered;
          state.confidence = reading.confidence;
          state.isManualMode = reading.confidence < 0.3;
          state.showLandmarkGuide =
            reading.accuracyMeters > 30 || reading.confidence < 0.3;
        }),

      setCurrentZone: (zone) =>
        set((state) => {
          state.currentZone = zone;
        }),

      setMiqatAssignment: (miqat) =>
        set((state) => {
          state.miqatAssignment = miqat;
        }),

      setMiqatStatus: (status) =>
        set((state) => {
          state.miqatStatus = status;
        }),

      setAlreadyCrossed: (value) =>
        set((state) => {
          state.alreadyCrossed = value;
        }),

      setIhramState: (ihramState) =>
        set((state) => {
          state.ihramState = ihramState;
        }),

      setRetroactiveConfirmed: (value) =>
        set((state) => {
          state.retroactiveConfirmed = value;
        }),

      setManualMode: (enabled) =>
        set((state) => {
          state.isManualMode = enabled;
          state.showLandmarkGuide = enabled;
        }),
    })),
    {
      name: 'location-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        miqatAssignment: state.miqatAssignment,
        miqatStatus: state.miqatStatus,
        alreadyCrossed: state.alreadyCrossed,
        ihramState: state.ihramState,
        retroactiveConfirmed: state.retroactiveConfirmed,
      }),
    }
  )
);
