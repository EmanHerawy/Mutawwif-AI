export type ProphetEntrySource =
  | 'bukhari'
  | 'muslim'
  | 'shamail'
  | 'ibn_hisham'
  | 'ibn_kathir';

export type ProphetCategory =
  | 'physical_description'  // الصفة الجسدية
  | 'character'             // الأخلاق والشخصية
  | 'daily_life'            // حياته اليومية
  | 'worship'               // عبادته وتهجده
  | 'mercy'                 // رحمته بالخلق
  | 'humor'                 // رفقه وتواضعه
  | 'family'                // حياته الأسرية
  | 'names_titles';         // أسماؤه وألقابه

export interface ProphetEntry {
  id: string;
  category: ProphetCategory;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  /** Formatted citation: e.g., "رواه البخاري — كتاب المناقب، باب صفة النبي ﷺ" */
  citationAr: string;
  /** Formatted citation: e.g., "Sahih Al-Bukhari — Book of Virtues, #3549" */
  citationEn: string;
  source: ProphetEntrySource;
  /** Initials of human reviewer who verified the content */
  reviewedBy: string;
}
