import type { AzkarItem } from '../types/azkar.types';

export const AZKAR_DATABASE: AzkarItem[] = [
  // Talbiyah
  {
    id: 'talbiyah',
    category: 'general',
    lapNumber: null,
    arabicText: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    transliteration: "Labbayka Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna l-ḥamda wa-n-ni'mata laka wa-l-mulk, lā sharīka lak",
    translationEn: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace and sovereignty belong to You. You have no partner.',
    translationUr: null,
    source: 'Bukhari 1549, Muslim 1184',
    audioFile: null,
    repeatCount: 3,
  },

  // Entering Haram
  {
    id: 'entering_haram',
    category: 'entering_haram',
    lapNumber: null,
    arabicText: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Bismillāh, wa-ṣ-ṣalātu wa-s-salāmu ʿalā rasūlillāh, Allāhumma ftaḥ lī abwāba raḥmatik',
    translationEn: 'In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, open for me the doors of Your mercy.',
    translationUr: null,
    source: 'Muslim 713',
    audioFile: null,
    repeatCount: 1,
  },

  // Tawaf — General (all laps)
  {
    id: 'tawaf_general_start',
    category: 'tawaf_general',
    lapNumber: null,
    arabicText: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
    transliteration: 'Bismillāhi wa-Allāhu Akbar',
    translationEn: 'In the name of Allah, and Allah is the Greatest.',
    translationUr: null,
    source: 'Abu Dawud 1870',
    audioFile: null,
    repeatCount: 1,
  },
  {
    id: 'tawaf_between_corners',
    category: 'tawaf_general',
    lapNumber: null,
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbanā ātinā fi-d-dunyā ḥasanatan wa-fi-l-ākhirati ḥasanatan wa-qinā ʿadhāba-n-nār",
    translationEn: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
    translationUr: null,
    source: 'Al-Baqarah 2:201 | Recited between Yemeni corner and Black Stone',
    audioFile: null,
    repeatCount: 1,
  },

  // Sa'i — Safa du'a
  {
    id: 'safa_start',
    category: 'sai_general',
    lapNumber: null,
    arabicText: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ',
    transliteration: 'Inna ṣ-Ṣafā wa-l-Marwata min shaʿāʾiri-llāh, abda\'u bi-mā bada\'a Allāhu bih',
    translationEn: 'Indeed Safa and Marwa are among the symbols of Allah. I begin with what Allah began with.',
    translationUr: null,
    source: 'Muslim 1218 | Recited at Safa before beginning Sa\'i',
    audioFile: null,
    repeatCount: 1,
  },
  {
    id: 'safa_supplication',
    category: 'sai_lap_specific',
    lapNumber: 1,
    arabicText: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Allāhu Akbar, Allāhu Akbar, Allāhu Akbar, wa-lillāhi-l-ḥamd, lā ilāha illā Allāhu waḥdahu lā sharīka lahu, lahu-l-mulku wa-lahu-l-ḥamdu wa-huwa ʿalā kulli shayin qadīr',
    translationEn: 'Allah is the Greatest (×3), and to Allah belongs all praise. There is no god but Allah alone, with no partner. To Him belongs the dominion, to Him belongs all praise, and He is over all things capable.',
    translationUr: null,
    source: 'Muslim 1218',
    audioFile: null,
    repeatCount: 3,
  },

  // Zamzam
  {
    id: 'zamzam_dua',
    category: 'zamzam',
    lapNumber: null,
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا وَاسِعًا وَشِفَاءً مِنْ كُلِّ دَاءٍ',
    transliteration: 'Allāhumma innī as\'aluka ʿilman nāfiʿan wa-rizqan wāsiʿan wa-shifāʾan min kulli dāʾ',
    translationEn: 'O Allah, I ask You for beneficial knowledge, abundant provision, and healing from every disease.',
    translationUr: null,
    source: '[SOURCE_NEEDED] — commonly recited at Zamzam',
    audioFile: null,
    repeatCount: 1,
  },

  // Morning Athkar
  {
    id: 'morning_general',
    category: 'morning',
    lapNumber: null,
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: 'Aṣbaḥnā wa-aṣbaḥa l-mulku lillāh, wa-l-ḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lahu',
    translationEn: 'We have entered the morning and the kingdom belongs to Allah. Praise be to Allah. There is no god but Allah alone, with no partner.',
    translationUr: null,
    source: 'Muslim 2723',
    audioFile: null,
    repeatCount: 1,
  },
];
