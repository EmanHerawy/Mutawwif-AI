export type EtiquetteCategory =
  | 'ihram_prohibitions'
  | 'common_mistakes'
  | 'masjid_haram_adab'
  | 'masjid_nabawi_adab'
  | 'makkah_madinah_adab'
  | 'rawdah_adab'
  | 'sitting_adab'
  | 'itikaf_adab'
  | 'general_adab';

export type EtiquetteSeverity =
  | 'obligation'   // فرض / واجب
  | 'forbidden'    // حرام
  | 'warning'      // تحذير / مكروه
  | 'sunnah'       // سنة
  | 'recommended'; // مستحب

export interface EtiquetteItem {
  id: string;
  category: EtiquetteCategory;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  source: string;          // never empty — use '[SOURCE_NEEDED]' if unverified
  applicableTo: 'all' | 'male' | 'female';
  mosque: 'haram' | 'nabawi' | 'both' | 'general';
  severity: EtiquetteSeverity;
  consequence?: string;
  tags: string[];
  permitsMistake?: boolean; // true = no sin/fidya if done by ignorance
}
