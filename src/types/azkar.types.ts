export type AzkarCategory =
  | 'tawaf_general'
  | 'tawaf_lap_specific'
  | 'sai_general'
  | 'sai_lap_specific'
  | 'entering_haram'
  | 'zamzam'
  | 'maqam_ibrahim'
  | 'morning'
  | 'evening'
  | 'general';

export interface AzkarItem {
  id: string;
  category: AzkarCategory;
  lapNumber: number | null;     // null = applies to all laps
  arabicText: string;
  transliteration: string;
  translationEn: string;
  translationUr: string | null;
  source: string | null;        // hadith reference or [SOURCE_NEEDED]
  audioFile: string | null;     // local asset path
  repeatCount: number;          // recommended repetitions
}
