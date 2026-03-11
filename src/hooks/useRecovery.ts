import { useEffect, useState } from 'react';
import { recoveryService } from '../services/recoveryService';

interface RecoveryState {
  hasIncompleteRitual: boolean;
  ritual: string | null;
  completedLaps: number;
  lastSavedAt: Date | null;
  hasDammWarning: boolean;
  skipOnboarding: boolean;
  isInitialized: boolean;
}

export function useRecovery() {
  const [state, setState] = useState<RecoveryState>({
    hasIncompleteRitual: false,
    ritual: null,
    completedLaps: 0,
    lastSavedAt: null,
    hasDammWarning: false,
    skipOnboarding: false,
    isInitialized: false,
  });

  useEffect(() => {
    const recoveryState = recoveryService.init();
    setState({ ...recoveryState, isInitialized: true });
  }, []);

  return state;
}
