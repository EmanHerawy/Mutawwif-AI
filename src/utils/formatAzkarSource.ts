/**
 * Format a hadith source citation for the user's language.
 * The `source` field in azkar-database.ts is English by default.
 * When the app is in Arabic mode we convert known book names and strip
 * the English context note (everything after " | ").
 */

const BOOK_NAMES_AR: Record<string, string> = {
  'Bukhari':       'البخاري',
  'Muslim':        'مسلم',
  'Abu Dawud':     'أبو داود',
  'Tirmidhi':      'الترمذي',
  'Nasa\'i':       'النسائي',
  "Nasa'i":        'النسائي',
  'Ibn Majah':     'ابن ماجة',
  'Ahmad':         'أحمد',
  'Ibn Khuzaymah': 'ابن خزيمة',
  'Ibn Hibban':    'ابن حبان',
  'Hakim':         'الحاكم',
  'Bayhaqi':       'البيهقي',
  'Al-Shafi\'i':   'الشافعي',
  "Al-Shafi'i":   'الشافعي',
  'Daraqutni':     'الدارقطني',
  'Malik':         'مالك',
  'Al-Baqarah':    'البقرة',
  'SOURCE_NEEDED': 'بحاجة للمصدر',
};

function toArabicNumerals(str: string): string {
  return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

/**
 * Returns the source citation in the appropriate language.
 * @param source  English source string from azkar-database.ts
 * @param sourceAr  Optional pre-written Arabic source (takes priority)
 * @param isAr  true when the UI language is Arabic
 */
export function formatAzkarSource(
  source: string | null,
  sourceAr: string | null | undefined,
  isAr: boolean,
): string | null {
  if (!source) return null;

  if (!isAr) {
    // English: strip the "| context note" and return the citation
    return source.split(' | ')[0];
  }

  // Arabic: use pre-written Arabic source if available
  if (sourceAr) return sourceAr;

  // Auto-format: strip the English context note after " | "
  const citation = source.split(' | ')[0];

  if (citation.includes('[SOURCE_NEEDED]')) {
    return '[بحاجة للمصدر]';
  }

  // Replace book names and convert numerals
  let result = citation;
  for (const [en, ar] of Object.entries(BOOK_NAMES_AR)) {
    result = result.replace(new RegExp(en.replace(/'/g, "\\'"), 'g'), ar);
  }

  // "رواه X NNNN, Y NNNN" → join with و
  result = result
    .replace(/,\s*/g, ' و')
    .replace(/—/g, '—');

  // If we successfully replaced any book name, prepend رواه
  if (result !== citation && !result.startsWith('رواه') && !result.startsWith('[')) {
    result = 'رواه ' + result;
  }

  return toArabicNumerals(result);
}
