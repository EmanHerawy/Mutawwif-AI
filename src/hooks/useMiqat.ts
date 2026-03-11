import { useLocationStore } from '../stores/locationStore';
import { MIQAT_ZONES } from '../data/miqat-zones';

export function useMiqat() {
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);
  const miqatStatus = useLocationStore((s) => s.miqatStatus);
  const alreadyCrossed = useLocationStore((s) => s.alreadyCrossed);
  const ihramState = useLocationStore((s) => s.ihramState);

  const miqatData = miqatAssignment
    ? MIQAT_ZONES.find((z) => z.id === miqatAssignment) ?? null
    : null;

  const isDammWarningActive = alreadyCrossed && ihramState === 'not_worn';

  return {
    miqatAssignment,
    miqatStatus,
    miqatData,
    alreadyCrossed,
    ihramState,
    isDammWarningActive,
  };
}
