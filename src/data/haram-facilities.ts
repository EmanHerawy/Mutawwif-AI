import type { FacilityInfo } from '../types/facility.types';

/**
 * Al-Masjid Al-Haram — Facilities
 * ⚪ Locations are approximate — verify on-site.
 *
 * Source: user-verified research from 2025 mosque maps and imagery.
 *
 * Layout reference (corrected 2025):
 *  - Gate 1   (SW)  = King Abdul Aziz Gate — closest to Mataf
 *  - Gate 79  (W)   = King Fahd Gate — escalators, main western approach
 *  - Gate 100 (N)   = King Abdullah Gate — 3rd expansion main entrance
 *  - Gate 62  (NW)  = Bab al-Umrah
 *  - Gate 45  (N)   = Bab al-Fatah
 *  - Gates 5–13 (S) = South cluster: Ajyad, Bilal, Hunayn, Ismail, Safa, Qubays
 *  - Gates 17–23 (E) = East: Ali, Abbas, Salam, Marwa
 *  - Gates 89, 94 (W) = Hujlah (women/disability), Ibrahim
 */
export const HARAM_FACILITIES: FacilityInfo[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // دورات المياه — RESTROOMS
  // Verified: Three main external complexes + 16,726 units in 3rd expansion
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_restroom_ajyad_3',
    mosque: 'haram',
    type: 'restroom',
    nameAr: 'مجمع دورات المياه رقم 3 — أجياد',
    nameEn: 'Restroom Complex #3 — Ajyad',
    locationAr: 'الساحة الجنوبية — بالقرب من نفق أجياد — تحت الساحة الخارجية',
    locationEn: 'South plaza — near Ajyad tunnel underpass — below the outdoor plaza',
    wing: 'south',
    floor: 'basement_1',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'مجمع خارجي كبير — دخول من مدخل نفق أجياد',
    notesEn: 'Large external complex — entry from Ajyad tunnel entrance',
    lat: 21.4183, lng: 39.8258, // VERIFY_COORDINATES
  },
  {
    id: 'haram_restroom_suq_saghir_6',
    mosque: 'haram',
    type: 'restroom',
    nameAr: 'مجمع دورات المياه رقم 6 — السوق الصغير',
    nameEn: 'Restroom Complex #6 — Al-Suq Al-Saghir',
    locationAr: 'الساحة الغربية — مقابل أبراج الساعة وفندق دار التوحيد',
    locationEn: 'West plaza — opposite the Clock Tower and Dar Al-Tawhid Hotel',
    wing: 'west',
    floor: 'ground',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'مجمع خارجي — الأكثر ازدحاماً في مواسم الذروة',
    notesEn: 'External complex — busiest during peak seasons',
    lat: 21.4225, lng: 39.8218, // VERIFY_COORDINATES
  },
  {
    id: 'haram_restroom_ghazza_9',
    mosque: 'haram',
    type: 'restroom',
    nameAr: 'مجمع دورات المياه رقم 9 — الغزة',
    nameEn: 'Restroom Complex #9 — Al-Ghazza',
    locationAr: 'الساحة الشرقية — بالقرب من محطات الحافلات ومخرج باب المروة (رقم 23)',
    locationEn: 'East plaza — near bus stations and Bab al-Marwa (gate 23) exit',
    wing: 'east',
    floor: 'ground',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'الأقرب للقادمين من الجهة الشرقية — نقطة توزيع الكراسي اليدوية بجانبه',
    notesEn: 'Nearest for pilgrims arriving from the east — manual wheelchair distribution point nearby',
    lat: 21.4232, lng: 39.8290, // VERIFY_COORDINATES
  },
  {
    id: 'haram_restroom_3rd_expansion',
    mosque: 'haram',
    type: 'restroom',
    nameAr: 'دورات المياه — التوسعة السعودية الثالثة',
    nameEn: 'Restrooms — Third Saudi Expansion',
    locationAr: 'الأدوار السفلية والأنفاق الشمالية للتوسعة الثالثة — أكثر من 16,726 وحدة',
    locationEn: 'Lower floors and north tunnels of the 3rd expansion — 16,726+ units',
    wing: 'north',
    floor: 'basement_1',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'مجهزة بمداخل للكراسي المتحركة ومقاعد للمسنين — اتجه لأي لافتة دورات مياه داخل التوسعة',
    notesEn: 'Wheelchair-accessible stalls and elderly seating — follow restroom signs inside the expansion',
    lat: 21.4305, lng: 39.8245, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // دور الوضوء — ABLUTION
  // Verified: 12,639 ablution points in 3rd expansion + rooftop + basement halls
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_wudu_basement',
    mosque: 'haram',
    type: 'wudu',
    nameAr: 'دار الوضوء الرئيسية — البدروم',
    nameEn: 'Main Ablution Hall — Basement',
    locationAr: 'البدروم الأول — تحت المطاف — أكبر دار وضوء. يُصل إليها بالسلالم الكهربائية أو المصاعد',
    locationEn: 'Basement level 1 — under the Mataf — largest ablution facility. Access via escalators or elevators',
    wing: 'central',
    floor: 'basement_1',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'مجهزة بمقاعد للمسنين وكراسي وحمامات لذوي الإعاقة — منفصلة للرجال والنساء',
    notesEn: 'Elderly seating, wheelchair accessible stalls — separate men\'s and women\'s sections',
    lat: 21.4225, lng: 39.8262, // VERIFY_COORDINATES
  },
  {
    id: 'haram_wudu_roof_arqam',
    mosque: 'haram',
    type: 'wudu',
    nameAr: 'دار الوضوء — سطح الأرقم',
    nameEn: 'Ablution Hall — Arqam Roof',
    locationAr: 'سطح المسجد (الجهة الشرقية) — يُصل إليه بالسلالم الكهربائية من الجناح الشرقي',
    locationEn: 'Mosque roof (east side) — access via escalators from the east wing',
    wing: 'east',
    floor: 'roof',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'يخدم المصلين في الأدوار العليا والسطح',
    notesEn: 'Serves worshippers on upper floors and rooftop',
    lat: 21.4228, lng: 39.8284, // VERIFY_COORDINATES
  },
  {
    id: 'haram_wudu_3rd_expansion',
    mosque: 'haram',
    type: 'wudu',
    nameAr: 'مياضئ التوسعة السعودية الثالثة',
    nameEn: 'Ablution — Third Saudi Expansion',
    locationAr: 'الأنفاق الشمالية والأدوار السفلية للتوسعة الثالثة — أكثر من 12,639 ميضأة',
    locationEn: 'North tunnels and lower floors of 3rd expansion — 12,639+ ablution points',
    wing: 'north',
    floor: 'basement_1',
    accessible: true,
    operatingHours: '24/7',
    lat: 21.4305, lng: 39.8248, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // مراكز طبية — MEDICAL
  // Verified locations per 2025 research
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_medical_hospital_north',
    mosque: 'haram',
    type: 'medical',
    nameAr: 'مستشفى الحرم للطوارئ',
    nameEn: 'Haram Emergency Hospital',
    locationAr: 'الساحات الشمالية — مقابل بوابات التوسعة الثالثة (بالقرب من باب 100)',
    locationEn: 'North plazas — facing 3rd expansion gates (near Gate 100)',
    wing: 'north',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'أطباء وممرضون مقيمون — سيارات إسعاف — طوارئ قلبية وإغماء وإجهاد حراري',
    notesEn: 'Resident doctors & nurses — ambulances — cardiac, fainting & heat exhaustion emergencies',
    lat: 21.4320, lng: 39.8245, // VERIFY_COORDINATES
  },
  {
    id: 'haram_medical_emergency_1',
    mosque: 'haram',
    type: 'medical',
    nameAr: 'مركز طوارئ رقم 1 — توسعة الملك فهد',
    nameEn: 'Emergency Center #1 — King Fahd Expansion',
    locationAr: 'الدور الأول — توسعة الملك فهد — بجوار باب رقم 88',
    locationEn: 'First floor — King Fahd expansion wing — adjacent to gate 88',
    wing: 'west',
    floor: 'floor_1',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'إسعافات أولية — حالات الإغماء والإجهاد الحراري',
    notesEn: 'First aid — fainting and heat exhaustion cases',
    lat: 21.4228, lng: 39.8220, // VERIFY_COORDINATES
  },
  {
    id: 'haram_medical_emergency_3',
    mosque: 'haram',
    type: 'medical',
    nameAr: 'مركز طوارئ رقم 3 — الرواق السعودي',
    nameEn: 'Emergency Center #3 — Saudi Portico',
    locationAr: 'الرواق السعودي — عند منطقة باب إسماعيل (رقم 10) — الدور الأرضي',
    locationEn: 'Saudi portico — near Bab Ismail (gate 10) area — ground floor',
    wing: 'south',
    floor: 'ground',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'إسعافات أولية — يُحال الحرجون لمستشفى أجياد أو مستشفى الحرم',
    notesEn: 'First aid — critical cases transferred to Ajyad or Haram hospitals',
    lat: 21.4183, lng: 39.8270, // VERIFY_COORDINATES
  },
  {
    id: 'haram_medical_emergency_4',
    mosque: 'haram',
    type: 'medical',
    nameAr: 'مركز طوارئ رقم 4 — الرواق السعودي الدور الأول',
    nameEn: 'Emergency Center #4 — Saudi Portico, Floor 1',
    locationAr: 'الرواق السعودي — الدور الأول — بجوار جسر أجياد',
    locationEn: 'Saudi portico — first floor — adjacent to Ajyad Bridge',
    wing: 'south',
    floor: 'floor_1',
    accessible: false,
    operatingHours: '24/7',
    lat: 21.4190, lng: 39.8260, // VERIFY_COORDINATES
  },
  {
    id: 'haram_medical_ajyad_hospital',
    mosque: 'haram',
    type: 'medical',
    nameAr: 'مستشفى أجياد للطوارئ',
    nameEn: 'Ajyad Emergency Hospital',
    locationAr: 'خارج الساحة الجنوبية — بجوار برج الساعة — على بعد 5 دقائق مشياً من باب أجياد',
    locationEn: 'Outside south plaza — adjacent to the Clock Tower — 5 min walk from Ajyad Gate',
    wing: 'south',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'مستشفى كامل — قسم إقامة — جراحة طوارئ — طوارئ القلب والأوعية الدموية',
    notesEn: 'Full hospital — inpatient ward — emergency surgery — cardiac & vascular emergencies',
    lat: 21.4175, lng: 39.8258, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // خدمات ذوي الإعاقة — DISABILITY SERVICES
  // Gates designated: 68, 69, 89, 93, 94, 114, 123
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_disability_main_desk',
    mosque: 'haram',
    type: 'disability_services',
    nameAr: 'مكتب خدمات ذوي الإعاقة — باب الملك عبد الله',
    nameEn: 'Disability Services Desk — King Abdullah Gate (100)',
    locationAr: 'مدخل باب الملك عبد الله (رقم 100) — يسار الداخل مباشرة — الدور الأرضي',
    locationEn: 'King Abdullah Gate (100) entrance — immediately left upon entry — ground floor',
    wing: 'north',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'استعارة كراسي متحركة يدوية وكهربائية — مرافق مدرّب للطواف والسعي — خدمة الترحيل الداخلي',
    notesEn: 'Manual & electric wheelchair lending — trained escort for Tawaf and Sa\'i — internal transport',
    lat: 21.4310, lng: 39.8244, // VERIFY_COORDINATES
  },
  {
    id: 'haram_disability_mataf_lane',
    mosque: 'haram',
    type: 'disability_services',
    nameAr: 'ممر الطواف لذوي الإعاقة',
    nameEn: 'Accessible Tawaf Lane',
    locationAr: 'الدور الأرضي من المطاف — الحلقة الخارجية — ممر مخصص للكراسي المتحركة',
    locationEn: 'Ground floor Mataf — outer ring — dedicated wheelchair lane',
    wing: 'central',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'ممر منظَّم بأفراد السلامة — أعطِ الأولوية دائماً لذوي الاحتياجات الخاصة',
    notesEn: 'Lane managed by safety staff — always give priority to special-needs pilgrims',
    lat: 21.4225, lng: 39.8265, // VERIFY_COORDINATES
  },
  {
    id: 'haram_disability_sai_level',
    mosque: 'haram',
    type: 'disability_services',
    nameAr: 'ممر السعي الخاص بذوي الإعاقة',
    nameEn: "Accessible Sa'i Corridor",
    locationAr: "الدور الأرضي من المسعى — ممر واسع مخصص للكراسي — يبدأ من الصفا (باب الصفا رقم 11)",
    locationEn: "Ground floor Masa'a — wide wheelchair-dedicated corridor — starts from Safa (Gate 11)",
    wing: 'east',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'الكراسي الكهربائية متاحة من مكتب الخدمات — لا رمل على ذوي الإعاقة الحركية',
    notesEn: 'Electric wheelchairs available from services desk — Raml is not required for mobility-impaired',
    lat: 21.4233, lng: 39.8278, // VERIFY_COORDINATES
  },
  {
    id: 'haram_disability_carts',
    mosque: 'haram',
    type: 'disability_services',
    nameAr: 'خدمة العربات الكهربائية (الجولف) — ذوو الإعاقة',
    nameEn: 'Electric Golf Cart Service — Mobility Impaired',
    locationAr: 'نقاط الانتظار: جسر الشبيكة (باب 64) — جسر أجياد (باب 4) — سلم أجياد الدور الأول',
    locationEn: 'Pickup points: Shubaikah Bridge (gate 64) — Ajyad Bridge (gate 4) — Ajyad escalators floor 1',
    wing: 'west',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'للنقل بين المداخل الرئيسية والمناطق الداخلية — طلب من مكتب الخدمات بأي باب رئيسي',
    notesEn: 'Transport between main entrances and inner areas — request from any main gate services desk',
    lat: 21.4238, lng: 39.8222, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // رعاية الأطفال — BABY CARE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_baby_expansion_3',
    mosque: 'haram',
    type: 'baby_care',
    nameAr: 'حضانة — التوسعة الثالثة (المنطقتان 13 و14)',
    nameEn: 'Nursery — 3rd Expansion (Zones 13 & 14)',
    locationAr: 'التوسعة السعودية الثالثة — المنطقتان 13 و14 — مقابل بوابتي 100 و104',
    locationEn: 'Third Saudi Expansion — zones 13 and 14 — facing gates 100 and 104',
    wing: 'north',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'طاولات تغيير — غرفة رضاعة خاصة — مياه نظيفة — طاقم نسائي فقط',
    notesEn: 'Changing tables — private nursing room — clean water — all-female staff',
    lat: 21.4312, lng: 39.8250, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // مياه زمزم — ZAMZAM
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_zamzam_basement',
    mosque: 'haram',
    type: 'zamzam',
    nameAr: 'صالة توزيع ماء زمزم — البدروم',
    nameEn: 'Zamzam Distribution Hall — Basement',
    locationAr: 'البدروم الأول — المنطقة المركزية تحت المطاف — بجانب دار الوضوء الرئيسية',
    locationEn: 'Basement level 1 — central zone below Mataf — next to main ablution hall',
    wing: 'central',
    floor: 'basement_1',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'موزعات ساخنة وباردة — كوبات ورقية — اشرب واقفاً مستقبلاً القبلة وفق السنة النبوية',
    notesEn: 'Hot and cold dispensers — paper cups — drink standing, facing Qibla per Sunnah',
    lat: 21.4225, lng: 39.8262, // VERIFY_COORDINATES
  },
  {
    id: 'haram_zamzam_porticos',
    mosque: 'haram',
    type: 'zamzam',
    nameAr: 'موزعات زمزم — الأروقة والأجنحة',
    nameEn: 'Zamzam Dispensers — Porticos & Wings',
    locationAr: 'موزعات منتشرة في جميع أروقة المسجد على الدور الأرضي والأول والتوسعة الثالثة',
    locationEn: 'Dispensers throughout all mosque porticos — ground floor, first floor, and 3rd expansion',
    wing: 'central',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    lat: 21.4225, lng: 39.8260, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // مراكز المعلومات والإرشاد — INFORMATION & GUIDANCE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_info_pilgrim_services',
    mosque: 'haram',
    type: 'information',
    nameAr: 'مركز خدمات الحجاج — باب الملك فهد',
    nameEn: 'Pilgrim Services Center — King Fahd Gate (79)',
    locationAr: 'مبنى خدمات الحجاج — خارج باب الملك فهد (رقم 79) — الجهة الشمالية الغربية',
    locationEn: 'Pilgrim Services Building — outside King Fahd Gate (79) — northwest side',
    wing: 'west',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'خرائط المسجد — إرشاد للمناسك — ترجمة بعدة لغات — استفسارات عامة',
    notesEn: 'Mosque maps — ritual guidance — multilingual translation — general inquiries',
    lat: 21.4228, lng: 39.8218, // VERIFY_COORDINATES
  },
  {
    id: 'haram_info_kiosk_74',
    mosque: 'haram',
    type: 'information',
    nameAr: 'كشك الإرشاد والفتوى — باب رقم 74',
    nameEn: 'Guidance & Fatwa Kiosk — Gate 74',
    locationAr: 'عند باب رقم 74 — كشك إرشادي ثابت — وهاتف "أجبني" المجاني (الروبوت التوجيهي)',
    locationEn: 'At gate 74 — permanent guidance kiosk — free "Ajibni" hotline (guidance robot) available',
    wing: 'north',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'إجابات فورية على أسئلة المناسك — بعدة لغات',
    notesEn: 'Instant answers to ritual questions — multiple languages',
    lat: 21.4268, lng: 39.8245, // VERIFY_COORDINATES
  },
  {
    id: 'haram_info_kiosk_47',
    mosque: 'haram',
    type: 'information',
    nameAr: 'كشك الإرشاد والفتوى — باب رقم 47',
    nameEn: 'Guidance & Fatwa Kiosk — Gate 47',
    locationAr: 'عند باب رقم 47 — كشك إرشادي ثابت للشؤون الإسلامية',
    locationEn: 'At gate 47 — permanent Islamic Affairs guidance kiosk',
    wing: 'north',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    lat: 21.4275, lng: 39.8252, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // المفقودات — LOST & FOUND
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_lost_found',
    mosque: 'haram',
    type: 'lost_found',
    nameAr: 'مكتب المفقودات والموجودات',
    nameEn: 'Lost & Found Office',
    locationAr: 'ساحة الغزة (الجانب الشرقي) — بجوار مكتبة مكة المكرمة',
    locationEn: 'Al-Ghazza plaza (east side) — adjacent to the Makkah Library',
    wing: 'east',
    floor: 'ground',
    accessible: false,
    operatingHours: '06:00–23:00',
    notesAr: 'احضر رقم هاتفك وبيانات إقامتك — وصف دقيق للغرض المفقود — رقم مرجعي يُعطى عند التبليغ',
    notesEn: 'Bring phone number and accommodation details — accurate description — reference number given on report',
    lat: 21.4232, lng: 39.8292, // VERIFY_COORDINATES
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // خدمات الحجاج والتنقل — PILGRIM SERVICES & TRANSPORT
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'haram_luggage_storage',
    mosque: 'haram',
    type: 'pilgrim_services',
    nameAr: 'صناديق الأمانات (حفظ الأمتعة)',
    nameEn: 'Luggage Storage — Lockers',
    locationAr: 'ثلاثة مواقع: أمام باب المروة (رقم 23) — ساحة أجياد — أمام باب الملك فهد (رقم 79)',
    locationEn: 'Three locations: outside Bab al-Marwa (23) — Ajyad plaza — in front of King Fahd Gate (79)',
    wing: 'east',
    floor: 'ground',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'رسوم رمزية — احتفظ بالمفتاح أثناء الطواف',
    notesEn: 'Nominal fee — keep the key with you during Tawaf',
    lat: 21.4230, lng: 39.8290, // VERIFY_COORDINATES
  },
  {
    id: 'haram_wheelchairs_manual',
    mosque: 'haram',
    type: 'pilgrim_services',
    nameAr: 'نقطة توزيع الكراسي المتحركة اليدوية',
    nameEn: 'Manual Wheelchair Distribution',
    locationAr: 'ساحة الغزة (أمام مجمع دورات مياه رقم 9) — والساحة الشرقية عند باب السلام (رقم 22)',
    locationEn: 'Al-Ghazza plaza (in front of restroom complex #9) — east plaza at Bab al-Salam (gate 22)',
    wing: 'east',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'مجانية — متاحة بكميات محدودة — يستلمها الأسرع',
    notesEn: 'Free of charge — limited availability — first come first served',
    lat: 21.4225, lng: 39.8288, // VERIFY_COORDINATES
  },
  {
    id: 'haram_bus_stations',
    mosque: 'haram',
    type: 'pilgrim_services',
    nameAr: 'محطات الحافلات الرئيسية',
    nameEn: 'Main Bus Stations',
    locationAr: 'ثلاثة مراكز: الغزة (شرقاً) — أجياد (جنوباً) — جبل عمر/الشبيكة (غرباً)',
    locationEn: 'Three hubs: Al-Ghazza (east) — Ajyad (south) — Jabal Omar/Shubaikah (west)',
    wing: 'east',
    floor: 'ground',
    accessible: false,
    operatingHours: '24/7',
    notesAr: 'خطوط إلى مشعر منى — مزدلفة — عرفات في مواسم الحج — تاكسي متاح طوال السنة',
    notesEn: 'Routes to Mina, Muzdalifa, Arafat during Hajj season — taxis available year-round',
    lat: 21.4232, lng: 39.8295, // VERIFY_COORDINATES
  },
  {
    id: 'haram_pilgrim_religious_desk',
    mosque: 'haram',
    type: 'pilgrim_services',
    nameAr: 'نقاط الإرشاد الديني — الشؤون الإسلامية',
    nameEn: 'Religious Guidance Points — Islamic Affairs',
    locationAr: 'عدة نقاط داخل المسجد على الأجنحة الرئيسية — الموظفون يرتدون الثوب الأخضر',
    locationEn: 'Multiple points inside the mosque across main wings — staff identifiable by green thobe',
    wing: 'central',
    floor: 'ground',
    accessible: true,
    operatingHours: '24/7',
    notesAr: 'فتاوى ميدانية في الأسئلة العاجلة — المسائل المعقدة تُحال للعالم',
    notesEn: 'Field rulings for urgent ritual questions — complex issues referred to qualified scholars',
    lat: 21.4225, lng: 39.8260, // VERIFY_COORDINATES
  },
];
