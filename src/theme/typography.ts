export const FontFamily = {
  amiri: 'Amiri',
  amiriBold: 'Amiri_Bold',
  lato: 'Lato',
  latoBold: 'Lato_Bold',
} as const;

export const FontSize = {
  // Standard mode
  bodyArabic: 18,
  headingArabic: 24,
  bodyLatin: 16,

  // High-Visibility (counters, active ritual)
  hvPrimary: 28,
  hvSupporting: 20,

  // Range for font scale slider
  scaleMin: 18,
  scaleMax: 28,

  // Touch target labels
  touchLabel: 16,
  caption: 14,
  small: 12,
} as const;

export const LineHeight = {
  body: 1.6,
  heading: 1.3,
  tight: 1.1,
} as const;
