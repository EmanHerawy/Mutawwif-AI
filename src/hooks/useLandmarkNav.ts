import { useState, useCallback } from 'react';
import { LANDMARKS } from '../data/landmarks';
import type { LandmarkData } from '../data/landmarks';
import { useLocationStore } from '../stores/locationStore';

export function useLandmarkNav() {
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);
  const showLandmarkGuide = useLocationStore((s) => s.showLandmarkGuide);
  const currentZone = useLocationStore((s) => s.currentZone);

  const kaabaCornersFor = useCallback(
    () => LANDMARKS.filter((l) => l.type === 'kaaba_corner'),
    []
  );

  const gatesFor = useCallback(
    () => LANDMARKS.filter((l) => l.type === 'gate'),
    []
  );

  const platformsFor = useCallback(
    () => LANDMARKS.filter((l) => l.type === 'platform'),
    []
  );

  const contextualLandmarks = useCallback(() => {
    if (currentZone === 'mataf_ground' || currentZone === 'mataf_floor2') {
      return LANDMARKS.filter(
        (l) => l.type === 'kaaba_corner' || l.type === 'gate'
      );
    }
    if (currentZone === 'masa' || currentZone === 'safa_platform' || currentZone === 'marwa_platform') {
      return LANDMARKS.filter((l) => l.type === 'platform');
    }
    return LANDMARKS;
  }, [currentZone]);

  return {
    showLandmarkGuide,
    selectedLandmark,
    setSelectedLandmark,
    allLandmarks: LANDMARKS,
    kaabaCornersFor,
    gatesFor,
    platformsFor,
    contextualLandmarks,
  };
}
