import type { Coordinates } from './location.types';

export type HeatStatus = 'normal' | 'caution' | 'danger' | 'extreme';

export interface HydrationLog {
  timestamp: Date;
  ritualId: string | null;
}

export interface HealthModel {
  currentTempCelsius: number | null;
  heatIndex: number | null;
  lastWeatherFetch: Date | null;
  hydrationAlertsToday: number;
  lastHydrationPrompt: Date | null;
  nearestClinicCoords: Coordinates | null;
  heatStatus: HeatStatus;
  hydrationLog: HydrationLog[];
}

export interface HealthClinic {
  id: string;
  nameAr: string;
  nameEn: string;
  zone: string;
  coordinates: Coordinates;
  phone: string | null;
}
