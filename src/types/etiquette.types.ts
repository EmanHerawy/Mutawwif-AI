export type EtiquetteCategory =
  | 'ihram_prohibitions'
  | 'ihram_permissions'
  | 'common_mistakes'
  | 'hajj_management'
  | 'masjid_adab'
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
  | 'recommended'; // مباح

export interface EtiquetteItem {
  id: string;
  category: EtiquetteCategory;
  /** i18n key: etiquette.{id}.title — resolved at render time */
  titleKey: string;
  /** i18n key: etiquette.{id}.content — resolved at render time */
  contentKey: string;
  source: string;              // never empty — use '[SOURCE_NEEDED]' if unverified
  applicableTo: 'all' | 'male' | 'female';
  mosque: 'haram' | 'nabawi' | 'both' | 'general';
  severity: EtiquetteSeverity;
  consequence?: string;
  tags: string[];
  permitsMistake?: boolean;    // true = no sin/fidya if done by ignorance
}
