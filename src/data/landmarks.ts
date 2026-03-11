export type LandmarkType = 'kaaba_corner' | 'gate' | 'platform' | 'pillar';

export interface LandmarkData {
  id: string;
  nameAr: string;
  nameEn: string;
  type: LandmarkType;
  relativePosition: string; // compass direction relative to Kaaba center
  svgAsset: string;         // reference key for SVG asset
  descriptionAr: string;
  descriptionEn: string;
}

export const LANDMARKS: LandmarkData[] = [
  // Kaaba Corners
  {
    id: 'black_stone',
    nameAr: 'الركن الأسود (الحجر الأسود)',
    nameEn: 'Black Stone Corner (Hajar Al-Aswad)',
    type: 'kaaba_corner',
    relativePosition: 'east',
    svgAsset: 'corner_black_stone',
    descriptionAr: 'ابدأ طوافك من هنا. الحجر الأسود في الركن الشرقي للكعبة.',
    descriptionEn: 'Start your Tawaf here. The Black Stone is in the eastern corner of the Kaaba.',
  },
  {
    id: 'yemeni_corner',
    nameAr: 'الركن اليماني',
    nameEn: 'Yemeni Corner',
    type: 'kaaba_corner',
    relativePosition: 'south',
    svgAsset: 'corner_yemeni',
    descriptionAr: 'الركن الجنوبي. استلامه أو الإشارة إليه سنة.',
    descriptionEn: 'Southern corner. It is Sunnah to touch or gesture toward it.',
  },
  {
    id: 'iraqi_corner',
    nameAr: 'الركن العراقي',
    nameEn: 'Iraqi Corner',
    type: 'kaaba_corner',
    relativePosition: 'north',
    svgAsset: 'corner_iraqi',
    descriptionAr: 'الركن الشمالي الغربي.',
    descriptionEn: 'North-western corner.',
  },
  {
    id: 'syrian_corner',
    nameAr: 'الركن الشامي',
    nameEn: 'Syrian Corner',
    type: 'kaaba_corner',
    relativePosition: 'west',
    svgAsset: 'corner_syrian',
    descriptionAr: 'الركن الشمالي.',
    descriptionEn: 'Northern corner.',
  },

  // Haram Gates
  {
    id: 'king_fahd_gate',
    nameAr: 'باب الملك فهد',
    nameEn: 'King Fahd Gate',
    type: 'gate',
    relativePosition: 'north-west',
    svgAsset: 'gate_king_fahd',
    descriptionAr: 'البوابة الرئيسية الشمالية الغربية.',
    descriptionEn: 'Main north-western gate.',
  },
  {
    id: 'umrah_gate',
    nameAr: 'باب العمرة',
    nameEn: 'Umrah Gate',
    type: 'gate',
    relativePosition: 'north',
    svgAsset: 'gate_umrah',
    descriptionAr: 'يُستخدم كثيراً للعمرة — شمال الحرم.',
    descriptionEn: 'Commonly used for Umrah — north of Haram.',
  },
  {
    id: 'salam_gate',
    nameAr: 'باب السلام',
    nameEn: 'Salam Gate',
    type: 'gate',
    relativePosition: 'north-east',
    svgAsset: 'gate_salam',
    descriptionAr: 'من أشهر بوابات الحرم.',
    descriptionEn: 'One of the most well-known Haram gates.',
  },

  // Sa'i Platforms
  {
    id: 'safa',
    nameAr: 'الصفا',
    nameEn: 'Safa',
    type: 'platform',
    relativePosition: 'south',
    svgAsset: 'platform_safa',
    descriptionAr: 'ابدأ السعي من هنا. الأشواط الفردية تبدأ من الصفا.',
    descriptionEn: 'Start Sa\'i here. Odd-numbered trips start from Safa.',
  },
  {
    id: 'marwa',
    nameAr: 'المروة',
    nameEn: 'Marwa',
    type: 'platform',
    relativePosition: 'north',
    svgAsset: 'platform_marwa',
    descriptionAr: 'نهاية الأشواط الفردية وبداية الأشواط الزوجية.',
    descriptionEn: 'End of odd trips and start of even trips.',
  },
];
