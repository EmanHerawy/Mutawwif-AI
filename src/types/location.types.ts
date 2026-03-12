export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GPSReadingModel {
  raw: Coordinates;
  filtered: Coordinates;
  confidence: number;   // 0–1
  isOutlier: boolean;
  timestamp: Date;
  accuracyMeters: number;
}

export type MiqatName =
  | 'dhul_hulayfah'
  | 'al_juhfah'
  | 'qarn_al_manazil'
  | 'dhat_irq'
  | 'yalamlam';

export type MiqatStatus =
  | 'not_assigned'
  | 'assigned'
  | 'approaching_50km'
  | 'approaching_10km'
  | 'at_miqat'
  | 'crossed';

export type IhramState =
  | 'not_worn'
  | 'active'
  | 'released'
  | 'crossed_without_ihram';

export type HaramZone =
  | 'mataf_ground'
  | 'mataf_floor2'
  | 'black_stone_checkpoint'
  | 'masa'
  | 'safa_platform'
  | 'marwa_platform'
  | 'haram_boundary'
  | 'mina'
  | 'arafat'
  | 'muzdalifah'
  | null;

export interface MiqatZoneData {
  id: MiqatName;
  nameAr: string;
  nameEn: string;
  coordinates: Coordinates;
  radiusKm: number;
}

export interface HaramZoneData {
  id: HaramZone;
  nameAr: string;
  nameEn: string;
  center: Coordinates;
  radiusMeters: number;
}
