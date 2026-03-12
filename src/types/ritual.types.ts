import type { HaramZone } from './location.types';

export type RitualCounterType = 'tawaf' | 'sai';

export interface TrackerPrefs {
  autoDetectLaps: boolean;  // GPS-based lap auto-detection (opt-in)
  trackSteps: boolean;      // Step count per lap via Pedometer (opt-in)
  trackTime: boolean;       // Elapsed time per lap (opt-in)
}

export interface LapRecord {
  lapNumber: number;
  startTime: Date;
  endTime: Date | null;
  durationMs: number | null;
  zone: HaramZone;
  gpsValidated: boolean;
  steps?: number;           // Steps counted during this lap (if trackSteps enabled)
  autoDetected?: boolean;   // true if lap was auto-detected by GPS
}

export interface RitualCounterModel {
  ritual: RitualCounterType;
  totalLaps: 7;
  completedLaps: number;
  currentLap: number;
  isPaused: boolean;
  pausedAt: Date | null;
  lapHistory: LapRecord[];
  startDirectionValidated: boolean;
  lastSavedAt: Date;
  isActive: boolean;
}

export type RitualStepStatus = 'pending' | 'active' | 'completed' | 'skipped';

export interface RitualStep {
  id: string;
  order: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  maleOnly: boolean;
  femaleOnly: boolean;
  hasCounter: boolean;
  counterType: RitualCounterType | null;
  status: RitualStepStatus;
  requiredZone: HaramZone | null;
}
