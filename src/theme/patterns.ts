// SVG pattern data for IslamicPatternBg component
// Geometric Islamic patterns — no human figures, no faces
export const IslamicPatterns = {
  geometric8Star: 'geometric_8_star',
  arabesque: 'arabesque',
  lattice: 'lattice',
} as const;

export type PatternKey = keyof typeof IslamicPatterns;
