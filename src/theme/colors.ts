export const Colors = {
  // Standard Mode
  brandGreen: '#1B4332',
  deepGreen: '#0D2818',
  goldAccent: '#C9A84C',
  lightGold: '#E9C97D',
  parchmentBg: '#FAF7F2',
  darkBg: '#0D1B12',
  alertWarning: '#D84315',
  textPrimary: '#1A1A1A',
  textInverse: '#FAF7F2',

  // High-Visibility Ritual Mode (active counter in sunlight)
  hvBackground: '#000000',
  hvTextPrimary: '#FFFFFF',
  hvLapNumber: '#C9A84C',
  hvCounterButton: '#FFFFFF',
  hvCounterButtonText: '#000000',

  // Heat Alert Overlay
  heatAlertBg: '#D84315',
  heatAlertText: '#FFFFFF',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Status
  success: '#2D6A4F',
  warning: '#F4A261',
  danger: '#D84315',
  info: '#2980B9',
} as const;

export type ColorKey = keyof typeof Colors;
