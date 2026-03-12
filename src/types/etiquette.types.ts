export type EtiquetteCategory =
  | 'ihram_prohibitions'       // محظورات الإحرام
  | 'ihram_permissions'        // مباحات الإحرام
  | 'hajj_umrah_rites'         // واجبات وسنن المناسك (الطواف، السعي، إلخ)
  | 'common_mistakes'          // أخطاء شائعة
  | 'hajj_management'          // إدارة الحشود والسلامة
  | 'masjid_adab'              // آداب المساجد
  | 'makkah_madinah_adab'      // آداب الحرمين الشريفين
  | 'rawdah_adab'              // آداب الروضة الشريفة
  | 'sitting_adab'             // آداب الجلوس في المسجد
  | 'itikaf_adab'              // آداب الاعتكاف
  | 'general_adab';            // آداب عامة

export type EtiquetteSeverity =
  /** واجب / فرض: ما أمر به الشارع إلزاماً. يُثاب فاعله امتثالاً ويستحق العقوبة تاركه */
  | 'obligatory'   
  /** محرم / محظور: ما نهى عنه الشارع إلزاماً. يُثاب تاركه امتثالاً ويستحق العقوبة فاعله */
  | 'forbidden'    
  /** مكروه: ما نهى عنه الشارع لا على وجه الإلزام. يُثاب تاركه امتثالاً ولا يُعاقب فاعله */
  | 'disliked'     
  /** سنة / مندوب / مستحب: ما أمر به الشارع لا على وجه الإلزام. يُثاب فاعله امتثالاً ولا يُعاقب تاركه */
  | 'recommended'  
  /** مباح / حلال / جائز: ما لا يتعلق به أمر ولا نهي لذاته. لا ثواب ولا عقاب فيه */
  | 'permissible'; 

export interface EtiquetteItem {
  id: string;
  category: EtiquetteCategory;
  /** i18n key: etiquette.{id}.title — resolved at render time */
  titleKey: string;
  /** i18n key: etiquette.{id}.content — resolved at render time */
  contentKey: string;
  /** Primary sources: e.g., Sahih Al-Bukhari, binbaz.org.sa. Use '[SOURCE_NEEDED]' if unverified */
  source: string;              
  applicableTo: 'all' | 'male' | 'female';
  /** Scope of the rule: Haram Makkah, Nabawi, Both, or General Islamic etiquette */
  mosque: 'haram' | 'nabawi' | 'both' | 'general';
  severity: EtiquetteSeverity;
  /** Arabic description of consequence: e.g., دم، فدية، أو بطلان النسك */
  consequenceAr?: string;
  /** English description of consequence: e.g., Sacrifice, Expiation, or Invalidation */
  consequenceEn?: string;
  tags: string[];
  /** If true, the action carries no sin/penalty if committed out of ignorance or forgetfulness */
  permitsMistake?: boolean;    
}