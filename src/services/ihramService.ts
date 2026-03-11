import type { MiqatName, IhramState } from '../types/location.types';

// ihramService is the SOLE authority for writing locationStore.ihramState
// Imports are done lazily to avoid circular dependency with stores

type IhramTransition = {
  from: IhramState;
  to: IhramState;
  trigger: string;
};

const VALID_TRANSITIONS: IhramTransition[] = [
  { from: 'not_worn', to: 'active', trigger: 'user_confirmed' },
  { from: 'not_worn', to: 'active', trigger: 'retroactive_confirmed' },
  { from: 'not_worn', to: 'crossed_without_ihram', trigger: 'miqat_crossed' },
  { from: 'active', to: 'released', trigger: 'ritual_complete' },
  { from: 'crossed_without_ihram', to: 'active', trigger: 'retroactive_confirmed' },
];

function isValidTransition(from: IhramState, to: IhramState, trigger: string): boolean {
  return VALID_TRANSITIONS.some(
    (t) => t.from === from && t.to === to && t.trigger === trigger
  );
}

class IhramService {
  // Called when user explicitly confirms Ihram at Miqat screen
  confirmIhram(currentState: IhramState): { newState: IhramState; success: boolean } {
    if (!isValidTransition(currentState, 'active', 'user_confirmed')) {
      return { newState: currentState, success: false };
    }
    return { newState: 'active', success: true };
  }

  // Called when user confirms they wore Ihram on the plane (retroactive)
  confirmRetroactive(
    currentState: IhramState,
    _miqatName: MiqatName
  ): { newState: IhramState; clearAlreadyCrossed: boolean; success: boolean } {
    if (!isValidTransition(currentState, 'active', 'retroactive_confirmed')) {
      return { newState: currentState, clearAlreadyCrossed: false, success: false };
    }
    return { newState: 'active', clearAlreadyCrossed: true, success: true };
  }

  // Called by miqatService when crossing detected without Ihram
  flagCrossedWithoutIhram(
    currentState: IhramState
  ): { newState: IhramState; success: boolean } {
    if (!isValidTransition(currentState, 'crossed_without_ihram', 'miqat_crossed')) {
      return { newState: currentState, success: false };
    }
    return { newState: 'crossed_without_ihram', success: true };
  }

  // Called after Halq/Taqsir step completion
  releaseIhram(currentState: IhramState): { newState: IhramState; success: boolean } {
    if (!isValidTransition(currentState, 'released', 'ritual_complete')) {
      return { newState: currentState, success: false };
    }
    return { newState: 'released', success: true };
  }

  // Called when user confirms scholar consultation (clears DammWarningGate)
  acknowledgeScholarConsultation(currentState: IhramState): {
    clearAlreadyCrossed: boolean;
  } {
    // Gate is cleared regardless — user has consulted a scholar
    // ihramState stays 'crossed_without_ihram' for logging; tabs re-enabled
    return { clearAlreadyCrossed: true };
  }
}

export const ihramService = new IhramService();
