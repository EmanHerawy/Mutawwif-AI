import type { GateInfo } from '../types/gate.types';

// VERIFY_COORDINATES — all gate positions are approximate and must be verified before production
export const HARAM_GATES_MOCK: GateInfo[] = [
  {
    id: 'haram_gate_abdul_aziz',
    nameAr: 'باب الملك عبد العزيز',
    nameEn: 'King Abdul Aziz Gate',
    number: 1,
    wing: 'north',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Main entrance — wheelchair ramp available',
    lat: 21.4248, lng: 39.8281, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_fahd',
    nameAr: 'باب الملك فهد (الفتح)',
    nameEn: 'King Fahd Gate (Bab al-Fatah)',
    number: 2,
    wing: 'northwest',
    status: 'crowded',
    accessible: true,
    mosque: 'haram',
    lat: 21.4253, lng: 39.8245, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_salam',
    nameAr: 'باب السلام',
    nameEn: 'Bab al-Salam',
    number: 3,
    wing: 'north',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: 'Historic gate — stairs only',
    lat: 21.4254, lng: 39.8260, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_umrah',
    nameAr: 'باب العمرة',
    nameEn: 'Bab al-Umrah',
    number: 4,
    wing: 'northwest',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    lat: 21.4242, lng: 39.8233, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_ibrahim',
    nameAr: 'باب إبراهيم',
    nameEn: 'Bab Ibrahim',
    number: 5,
    wing: 'west',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4218, lng: 39.8233, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_bayt',
    nameAr: 'باب البيت',
    nameEn: 'Bab al-Bayt',
    number: 6,
    wing: 'west',
    status: 'crowded',
    accessible: false,
    mosque: 'haram',
    lat: 21.4210, lng: 39.8243, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_safa',
    nameAr: 'باب الصفا',
    nameEn: 'Bab al-Safa',
    number: 7,
    wing: 'south',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: "Closest gate to Masa'a (Sa'i walkway)",
    lat: 21.4198, lng: 39.8258, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_marwa',
    nameAr: 'باب المروة',
    nameEn: 'Bab al-Marwa',
    number: 8,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4205, lng: 39.8275, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_ajyad',
    nameAr: 'باب أجياد',
    nameEn: 'Bab Ajyad',
    number: 9,
    wing: 'south',
    status: 'full',
    accessible: false,
    mosque: 'haram',
    notes: 'Currently at capacity — use adjacent gates',
    lat: 21.4196, lng: 39.8260, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_malik',
    nameAr: 'باب الملك',
    nameEn: 'Bab al-Malik',
    number: 10,
    wing: 'southeast',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4202, lng: 39.8278, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_nisa',
    nameAr: 'باب النساء',
    nameEn: 'Bab al-Nisa',
    number: 11,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: "Designated women's entrance",
    lat: 21.4218, lng: 39.8285, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_qurashi',
    nameAr: 'باب القرشي',
    nameEn: 'Bab al-Qurashi',
    number: 12,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4228, lng: 39.8286, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_hujun',
    nameAr: 'باب الحجون',
    nameEn: 'Bab al-Hujun',
    number: 13,
    wing: 'northeast',
    status: 'closed',
    accessible: false,
    mosque: 'haram',
    notes: 'Temporarily closed for maintenance',
    lat: 21.4245, lng: 39.8283, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_shubaikah',
    nameAr: 'باب الشبيكة',
    nameEn: 'Bab al-Shubaikah',
    number: 14,
    wing: 'northeast',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4247, lng: 39.8273, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_abu_bakr',
    nameAr: 'باب أبو بكر الصديق',
    nameEn: 'Bab Abu Bakr Al-Siddiq',
    number: 15,
    wing: 'northwest',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4252, lng: 39.8248, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_umar',
    nameAr: 'باب عمر بن الخطاب',
    nameEn: 'Bab Umar ibn al-Khattab',
    number: 16,
    wing: 'north',
    status: 'crowded',
    accessible: false,
    mosque: 'haram',
    lat: 21.4254, lng: 39.8256, // VERIFY_COORDINATES
  },
];
