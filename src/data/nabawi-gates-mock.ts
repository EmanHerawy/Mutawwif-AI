import type { GateInfo } from '../types/gate.types';

// VERIFY_COORDINATES — all gate positions are approximate and must be verified before production
export const NABAWI_GATES_MOCK: GateInfo[] = [
  {
    id: 'nabawi_gate_jibril',
    nameAr: 'باب جبريل',
    nameEn: 'Bab Jibril',
    number: 1,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    notes: 'Main eastern entrance — historic gate',
    lat: 24.4672, lng: 39.6131, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_salam',
    nameAr: 'باب السلام',
    nameEn: 'Bab al-Salam',
    number: 21,
    wing: 'north',
    status: 'open',
    accessible: true,
    mosque: 'nabawi',
    notes: 'Main northern entrance — ramp accessible',
    lat: 24.4690, lng: 39.6112, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_rahman',
    nameAr: 'باب الرحمة',
    nameEn: 'Bab al-Rahman',
    number: 22,
    wing: 'north',
    status: 'crowded',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4690, lng: 39.6103, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_nisa',
    nameAr: 'باب النساء (٢٥)',
    nameEn: 'Bab al-Nisa (Gate 25)',
    number: 25,
    wing: 'east',
    status: 'open',
    accessible: true,
    mosque: 'nabawi',
    notes: "Women's entrance — Gates 25 and 29 area",
    lat: 24.4665, lng: 39.6131, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_nisa_29',
    nameAr: 'باب النساء (٢٩)',
    nameEn: 'Bab al-Nisa (Gate 29)',
    number: 29,
    wing: 'east',
    status: 'open',
    accessible: true,
    mosque: 'nabawi',
    notes: "Women's entrance — eastern prayer hall access",
    lat: 24.4675, lng: 39.6133, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_baqi',
    nameAr: 'باب البقيع',
    nameEn: 'Bab al-Baqi',
    number: 30,
    wing: 'west',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    notes: 'Faces Al-Baqi cemetery',
    lat: 24.4672, lng: 39.6093, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_abu_bakr',
    nameAr: 'باب أبو بكر الصديق',
    nameEn: 'Bab Abu Bakr Al-Siddiq',
    number: 5,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4655, lng: 39.6105, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_umar',
    nameAr: 'باب عمر بن الخطاب',
    nameEn: 'Bab Umar ibn al-Khattab',
    number: 6,
    wing: 'south',
    status: 'crowded',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4655, lng: 39.6112, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_uthman',
    nameAr: 'باب عثمان بن عفان',
    nameEn: 'Bab Uthman ibn Affan',
    number: 7,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4655, lng: 39.6120, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_ali',
    nameAr: 'باب علي بن أبي طالب',
    nameEn: 'Bab Ali ibn Abi Talib',
    number: 8,
    wing: 'southeast',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4657, lng: 39.6127, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_siddiq',
    nameAr: 'باب الصديق',
    nameEn: 'Bab al-Siddiq',
    number: 10,
    wing: 'southwest',
    status: 'full',
    accessible: false,
    mosque: 'nabawi',
    notes: 'Currently at capacity — use adjacent gates',
    lat: 24.4657, lng: 39.6098, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_malik',
    nameAr: 'باب الملك عبد العزيز',
    nameEn: 'King Abdul Aziz Gate',
    number: 15,
    wing: 'west',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    lat: 24.4672, lng: 39.6090, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_fahd',
    nameAr: 'باب الملك فهد',
    nameEn: 'King Fahd Gate',
    number: 16,
    wing: 'northwest',
    status: 'closed',
    accessible: false,
    mosque: 'nabawi',
    notes: 'Temporarily closed',
    lat: 24.4685, lng: 39.6095, // VERIFY_COORDINATES
  },
  {
    id: 'nabawi_gate_majidi',
    nameAr: 'باب المجيدي',
    nameEn: 'Bab al-Majidi',
    number: 3,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'nabawi',
    notes: 'Historic gate from Ottoman expansion',
    lat: 24.4677, lng: 39.6129, // VERIFY_COORDINATES
  },
];
