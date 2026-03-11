export type Gender = 'male' | 'female';

export type RitualType =
  | 'umrah'
  | 'hajj_tamattu'
  | 'hajj_qiran'
  | 'hajj_ifrad';

export type MobilityLevel = 'standard' | 'reduced' | 'wheelchair';

export type DialectKey =
  | 'egyptian'
  | 'gulf'
  | 'standard_arabic'
  | 'urdu';

export interface PersonaModel {
  name: string;
  gender: Gender;
  nationalityCode: string;       // ISO 3166-1 alpha-2
  languageCode: string;          // BCP-47
  dialectKey: DialectKey;
  ritualType: RitualType;
  originConfirmed: string;       // departure city
  mobilityLevel: MobilityLevel;
  emergencyContactName: string;  // required — not optional
  emergencyContactPhone: string; // required — used by SOS
  hotelName: string;
  hotelAddress: string;
}
