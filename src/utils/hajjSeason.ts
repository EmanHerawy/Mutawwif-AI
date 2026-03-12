// Approximate Gregorian windows for Hajj months (Shawwal–Dhul Hijja) 2025–2028
const HAJJ_SEASONS = [
  { start: new Date('2025-03-30'), end: new Date('2025-08-28') },
  { start: new Date('2026-03-20'), end: new Date('2026-08-17') },
  { start: new Date('2027-03-09'), end: new Date('2027-08-07') },
  { start: new Date('2028-02-27'), end: new Date('2028-07-26') },
];

export function isHajjSeason(): boolean {
  const now = new Date();
  return HAJJ_SEASONS.some((s) => now >= s.start && now <= s.end);
}
