export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Touch target minimums (accessibility)
export const TouchTarget = {
  standard: 56,  // 56px minimum per spec
  counter: 80,   // Counter button — 80px minimum
  sos: 64,       // SOS button
} as const;
