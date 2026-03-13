/**
 * Safe Date coercion helpers for Zustand rehydration.
 *
 * AsyncStorage serialises via JSON.stringify, so Date objects become ISO strings.
 * These helpers restore them to Date instances during onRehydrateStorage.
 */

export function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function toDateOrNull(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? null : d;
}
