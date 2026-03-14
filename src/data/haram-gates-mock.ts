import type { GateInfo } from '../types/gate.types';

// VERIFY_COORDINATES — positions are approximate and must be field-verified before production.
// Source: user-verified research from 2025 maps and mosque imagery.
// Al-Masjid Al-Haram has 210+ gates; the following are the strategically significant ones.
export const HARAM_GATES_MOCK: GateInfo[] = [

  // ── الخمس البوابات الرئيسية (كل منها بمئذنتين مزدوجتين) ──────────────────

  {
    id: 'haram_gate_abdulaziz',
    nameAr: 'باب الملك عبد العزيز',
    nameEn: 'King Abdul Aziz Gate',
    number: 1,
    wing: 'southwest',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Closest gate to the Mataf — main western entry for Tawaf — wheelchair ramp',
    lat: 21.4218, lng: 39.8230, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_fahd',
    nameAr: 'باب الملك فهد',
    nameEn: 'King Fahd Gate',
    number: 79,
    wing: 'west',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Escalators to upper floors — disability services desk immediately left inside',
    lat: 21.4225, lng: 39.8222, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_abdullah',
    nameAr: 'باب الملك عبد الله',
    nameEn: 'King Abdullah Gate',
    number: 100,
    wing: 'north',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Largest gate — main entrance to the Third Saudi Expansion — pilgrim services inside',
    lat: 21.4310, lng: 39.8245, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_umrah',
    nameAr: 'باب العمرة',
    nameEn: 'Bab al-Umrah',
    number: 62,
    wing: 'northwest',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Primary gate for pilgrims arriving from the northwest — wheelchair accessible',
    lat: 21.4250, lng: 39.8228, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_fatah',
    nameAr: 'باب الفتح',
    nameEn: 'Bab al-Fatah',
    number: 45,
    wing: 'north',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: 'Historically linked to the route of the Conquest of Makkah',
    lat: 21.4280, lng: 39.8255, // VERIFY_COORDINATES
  },

  // ── الجهة الجنوبية ──────────────────────────────────────────────────────────

  {
    id: 'haram_gate_ajyad',
    nameAr: 'باب أجياد',
    nameEn: 'Bab Ajyad',
    number: 5,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: 'Near the main south restroom complex (#3) — Ajyad tunnel underpass nearby',
    lat: 21.4183, lng: 39.8257, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_bilal',
    nameAr: 'باب بلال',
    nameEn: 'Bab Bilal',
    number: 6,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4183, lng: 39.8265, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_hunayn',
    nameAr: 'باب حنين',
    nameEn: 'Bab Hunayn',
    number: 9,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4182, lng: 39.8258, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_ismail',
    nameAr: 'باب إسماعيل',
    nameEn: 'Bab Ismail',
    number: 10,
    wing: 'south',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: 'Emergency clinic #3 is in the Saudi portico near this gate',
    lat: 21.4183, lng: 39.8270, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_safa',
    nameAr: 'باب الصفا',
    nameEn: 'Bab al-Safa',
    number: 11,
    wing: 'south',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: "Closest gate to the Masa'a (Sa'i walkway) — accessible ramp available",
    lat: 21.4185, lng: 39.8275, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_qubays',
    nameAr: 'باب قبيس',
    nameEn: 'Bab Qubays',
    number: 13,
    wing: 'southeast',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4187, lng: 39.8282, // VERIFY_COORDINATES
  },

  // ── الجهة الشرقية ──────────────────────────────────────────────────────────

  {
    id: 'haram_gate_ali',
    nameAr: 'باب علي',
    nameEn: 'Bab Ali',
    number: 17,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4205, lng: 39.8287, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_abbas',
    nameAr: 'باب العباس',
    nameEn: 'Bab al-Abbas',
    number: 20,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    lat: 21.4215, lng: 39.8288, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_salam',
    nameAr: 'باب السلام',
    nameEn: 'Bab al-Salam',
    number: 22,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: 'Manual wheelchairs available from the east side plaza near this gate',
    lat: 21.4225, lng: 39.8288, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_marwa',
    nameAr: 'باب المروة',
    nameEn: 'Bab al-Marwa',
    number: 23,
    wing: 'east',
    status: 'open',
    accessible: false,
    mosque: 'haram',
    notes: "Near Al-Ghazza plaza restroom complex (#9) and bus stations — luggage storage available outside",
    lat: 21.4230, lng: 39.8288, // VERIFY_COORDINATES
  },

  // ── الجهة الغربية ──────────────────────────────────────────────────────────

  {
    id: 'haram_gate_hujlah',
    nameAr: 'باب الحجلة',
    nameEn: 'Bab al-Hujlah',
    number: 89,
    wing: 'west',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: "Designated women's entrance — also accessible for disability services (gates 89, 93, 94)",
    lat: 21.4235, lng: 39.8222, // VERIFY_COORDINATES
  },
  {
    id: 'haram_gate_ibrahim',
    nameAr: 'باب إبراهيم',
    nameEn: 'Bab Ibrahim',
    number: 94,
    wing: 'west',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: 'Disability-accessible gate — electric cart pickup point nearby',
    lat: 21.4240, lng: 39.8220, // VERIFY_COORDINATES
  },

  // ── بوابات مخصصة ──────────────────────────────────────────────────────────

  {
    id: 'haram_gate_nisa_104',
    nameAr: 'باب النساء (١٠٤)',
    nameEn: "Women's Gate (104)",
    number: 104,
    wing: 'north',
    status: 'open',
    accessible: true,
    mosque: 'haram',
    notes: "Designated women's entrance in the 3rd expansion — near childcare zone 14",
    lat: 21.4315, lng: 39.8252, // VERIFY_COORDINATES
  },
];
