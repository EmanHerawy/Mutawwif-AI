import type { HealthClinic } from '../types/health.types';

// VERIFY_COORDINATES — all coordinates must be confirmed with Saudi Health Ministry before production release
export const HEALTH_CLINICS: HealthClinic[] = [
  // Masjid Al-Haram
  {
    id: 'haram_gate1_clinic',
    nameAr: 'مستوصف باب الملك',
    nameEn: 'Haram Clinic — Gate 1 Area',
    zone: 'haram_boundary',
    coordinates: { latitude: 21.4267, longitude: 39.8267 }, // VERIFY_COORDINATES
    phone: null,
  },
  {
    id: 'haram_gate4_clinic',
    nameAr: 'مستوصف الباب الرابع',
    nameEn: 'Haram Clinic — Gate 4 Area',
    zone: 'haram_boundary',
    coordinates: { latitude: 21.4225, longitude: 39.8228 }, // VERIFY_COORDINATES
    phone: null,
  },
  {
    id: 'haram_gate79_clinic',
    nameAr: 'مستوصف الباب 79',
    nameEn: 'Haram Clinic — Gate 79 Area',
    zone: 'haram_boundary',
    coordinates: { latitude: 21.4210, longitude: 39.8275 }, // VERIFY_COORDINATES
    phone: null,
  },

  // Mina
  {
    id: 'mina_red_crescent_1',
    nameAr: 'مركز الهلال الأحمر — منى 1',
    nameEn: 'Saudi Red Crescent — Mina Station 1',
    zone: 'mina',
    coordinates: { latitude: 21.4133, longitude: 39.8933 }, // VERIFY_COORDINATES
    phone: '911',
  },
  {
    id: 'mina_red_crescent_2',
    nameAr: 'مركز الهلال الأحمر — منى 2',
    nameEn: 'Saudi Red Crescent — Mina Station 2',
    zone: 'mina',
    coordinates: { latitude: 21.4155, longitude: 39.8980 }, // VERIFY_COORDINATES
    phone: '911',
  },

  // Arafat
  {
    id: 'arafat_nimra_clinic',
    nameAr: 'مستوصف مسجد نمرة',
    nameEn: 'Nimra Mosque Clinic — Arafat',
    zone: 'arafat',
    coordinates: { latitude: 21.3556, longitude: 39.9751 }, // VERIFY_COORDINATES
    phone: '911',
  },
  {
    id: 'arafat_main_clinic',
    nameAr: 'المستوصف الرئيسي — عرفات',
    nameEn: 'Main Clinic — Arafat',
    zone: 'arafat',
    coordinates: { latitude: 21.3544, longitude: 39.9838 }, // VERIFY_COORDINATES
    phone: '911',
  },

  // Muzdalifah
  {
    id: 'muzdalifah_emergency',
    nameAr: 'مركز الطوارئ — مزدلفة',
    nameEn: 'Emergency Post — Muzdalifah',
    zone: 'muzdalifah',
    coordinates: { latitude: 21.3878, longitude: 39.9367 }, // VERIFY_COORDINATES
    phone: '911',
  },
];
