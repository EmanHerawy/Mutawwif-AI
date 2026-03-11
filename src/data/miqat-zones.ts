import type { MiqatZoneData } from '../types/location.types';

// VERIFY_COORDINATES — validate against Saudi Ministry of Hajj before production release
export const MIQAT_ZONES: MiqatZoneData[] = [
  {
    id: 'dhul_hulayfah',
    nameAr: 'ذو الحليفة (أبيار علي)',
    nameEn: "Dhul Hulayfah (Abyar Ali)",
    coordinates: { latitude: 24.4136, longitude: 39.5354 },
    radiusKm: 5,
  },
  {
    id: 'al_juhfah',
    nameAr: 'الجحفة (رابغ)',
    nameEn: 'Al-Juhfah (Rabigh)',
    coordinates: { latitude: 22.7964, longitude: 39.0339 },
    radiusKm: 5,
  },
  {
    id: 'qarn_al_manazil',
    nameAr: 'قرن المنازل (السيل الكبير)',
    nameEn: 'Qarn Al-Manazil (Al-Sayl Al-Kabeer)',
    coordinates: { latitude: 21.6333, longitude: 40.4167 },
    radiusKm: 5,
  },
  {
    id: 'dhat_irq',
    nameAr: 'ذات عرق',
    nameEn: 'Dhat Irq',
    coordinates: { latitude: 22.0000, longitude: 42.0000 },
    radiusKm: 5,
  },
  {
    id: 'yalamlam',
    nameAr: 'يلملم (السعدية)',
    nameEn: 'Yalamlam (Al-Sadiah)',
    coordinates: { latitude: 20.5500, longitude: 40.1500 },
    radiusKm: 5,
  },
];

// Kaaba center for bearing calculations
export const KAABA_COORDS = { latitude: 21.4225, longitude: 39.8262 };

// Jeddah airport bounding box for special-case detection
export const JEDDAH_AIRPORT = {
  center: { latitude: 21.6796, longitude: 39.1565 },
  radiusKm: 10,
};
