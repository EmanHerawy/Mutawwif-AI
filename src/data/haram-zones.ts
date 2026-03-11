import type { HaramZoneData } from '../types/location.types';

// VERIFY_COORDINATES — all coordinates must be validated before production release
export const HARAM_ZONES: HaramZoneData[] = [
  {
    id: 'mataf_ground',
    nameAr: 'المطاف (الطابق الأرضي)',
    nameEn: 'Mataf — Ground Floor',
    center: { latitude: 21.4225, longitude: 39.8262 },
    radiusMeters: 80,
  },
  {
    id: 'mataf_floor2',
    nameAr: 'المطاف (الطابق الثاني)',
    nameEn: 'Mataf — Second Floor',
    center: { latitude: 21.4225, longitude: 39.8262 },
    radiusMeters: 90,
  },
  {
    id: 'masa',
    nameAr: 'المسعى',
    nameEn: "Mas'a (Sa'i corridor)",
    center: { latitude: 21.4234, longitude: 39.8282 },
    radiusMeters: 130,
  },
  {
    id: 'safa_platform',
    nameAr: 'الصفا',
    nameEn: 'Safa Platform',
    center: { latitude: 21.4228, longitude: 39.8256 },
    radiusMeters: 25,
  },
  {
    id: 'marwa_platform',
    nameAr: 'المروة',
    nameEn: 'Marwa Platform',
    center: { latitude: 21.4241, longitude: 39.8308 },
    radiusMeters: 25,
  },
  {
    id: 'haram_boundary',
    nameAr: 'حدود الحرم',
    nameEn: 'Haram Boundary',
    center: { latitude: 21.4225, longitude: 39.8262 },
    radiusMeters: 400,
  },
  {
    id: 'mina',
    nameAr: 'منى',
    nameEn: 'Mina',
    center: { latitude: 21.4133, longitude: 39.8933 },
    radiusMeters: 3000,
  },
  {
    id: 'arafat',
    nameAr: 'عرفات',
    nameEn: 'Arafat',
    center: { latitude: 21.3544, longitude: 39.9838 },
    radiusMeters: 5000,
  },
  {
    id: 'muzdalifah',
    nameAr: 'مزدلفة',
    nameEn: 'Muzdalifah',
    center: { latitude: 21.3878, longitude: 39.9367 },
    radiusMeters: 4000,
  },
];
