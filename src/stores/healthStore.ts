import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HealthModel, HeatStatus, HydrationLog } from '../types/health.types';
import type { Coordinates } from '../types/location.types';

interface HealthState extends HealthModel {
  setWeatherData: (temp: number, heatIndex: number) => void;
  setHeatStatus: (status: HeatStatus) => void;
  logHydrationAlert: (ritualId: string | null) => void;
  acknowledgeHydration: () => void;
  setNearestClinic: (coords: Coordinates | null) => void;
  resetDailyCounters: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    immer((set) => ({
      currentTempCelsius: null,
      heatIndex: null,
      lastWeatherFetch: null,
      hydrationAlertsToday: 0,
      lastHydrationPrompt: null,
      nearestClinicCoords: null,
      heatStatus: 'normal',
      hydrationLog: [],

      setWeatherData: (temp, heatIndex) =>
        set((state) => {
          state.currentTempCelsius = temp;
          state.heatIndex = heatIndex;
          state.lastWeatherFetch = new Date();

          if (temp >= 45) state.heatStatus = 'extreme';
          else if (temp >= 40) state.heatStatus = 'danger';
          else if (temp >= 35) state.heatStatus = 'caution';
          else state.heatStatus = 'normal';
        }),

      setHeatStatus: (status) =>
        set((state) => {
          state.heatStatus = status;
        }),

      logHydrationAlert: (ritualId) =>
        set((state) => {
          state.hydrationAlertsToday += 1;
          const log: HydrationLog = {
            timestamp: new Date(),
            ritualId,
          };
          state.hydrationLog.push(log);
        }),

      acknowledgeHydration: () =>
        set((state) => {
          state.lastHydrationPrompt = new Date();
        }),

      setNearestClinic: (coords) =>
        set((state) => {
          state.nearestClinicCoords = coords;
        }),

      resetDailyCounters: () =>
        set((state) => {
          state.hydrationAlertsToday = 0;
          state.hydrationLog = [];
        }),
    })),
    {
      name: 'health-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        heatStatus: state.heatStatus,
        lastHydrationPrompt: state.lastHydrationPrompt,
        hydrationAlertsToday: state.hydrationAlertsToday,
        hydrationLog: state.hydrationLog,
      }),
    }
  )
);
