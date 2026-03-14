export type FacilityType =
  | 'restroom'
  | 'wudu'
  | 'medical'
  | 'pharmacy'
  | 'disability_services'
  | 'baby_care'
  | 'information'
  | 'lost_found'
  | 'zamzam'
  | 'pilgrim_services';

export type FacilityFloor =
  | 'basement_2'
  | 'basement_1'
  | 'ground'
  | 'floor_1'
  | 'floor_2'
  | 'roof';

export type FacilityWing =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest'
  | 'central';

export interface FacilityInfo {
  id: string;
  mosque: 'haram' | 'nabawi';
  type: FacilityType;
  nameAr: string;
  nameEn: string;
  /** Human-readable directions in Arabic */
  locationAr: string;
  /** Human-readable directions in English */
  locationEn: string;
  wing: FacilityWing;
  floor: FacilityFloor;
  /** true = wheelchair-accessible (ramps / elevators / wide corridors) */
  accessible: boolean;
  operatingHours: string;
  notesAr?: string;
  notesEn?: string;
  /** Approximate coordinates — VERIFY_COORDINATES before production */
  lat?: number;
  lng?: number;
}
