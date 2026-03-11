import { useRitualStore } from '../stores/ritualStore';
import { useLocationStore } from '../stores/locationStore';
import { usePersonaStore } from '../stores/personaStore';
import { geofenceService } from './geofenceService';

interface RecoveryState {
  hasIncompleteRitual: boolean;
  ritual: string | null;
  completedLaps: number;
  lastSavedAt: Date | null;
  hasDammWarning: boolean;
  skipOnboarding: boolean;
}

class RecoveryService {
  private subscriptions: Array<() => void> = [];

  init(): RecoveryState {
    this.registerSubscriptions();
    return this.evaluate();
  }

  private evaluate(): RecoveryState {
    const ritualState = useRitualStore.getState();
    const locationState = useLocationStore.getState();
    const personaState = usePersonaStore.getState();

    const hasIncompleteRitual =
      ritualState.counter !== null &&
      ritualState.counter.completedLaps > 0 &&
      ritualState.counter.completedLaps < 7 &&
      ritualState.isActive;

    const hasDammWarning =
      locationState.alreadyCrossed && locationState.ihramState === 'not_worn';

    return {
      hasIncompleteRitual,
      ritual: ritualState.counter?.ritual ?? null,
      completedLaps: ritualState.counter?.completedLaps ?? 0,
      lastSavedAt: ritualState.counter?.lastSavedAt ?? null,
      hasDammWarning,
      skipOnboarding: personaState.isOnboardingComplete,
    };
  }

  // Register Zustand store-to-store subscriptions (NOT useEffect)
  private registerSubscriptions() {
    // Unsubscribe any existing subscriptions
    this.cleanup();

    // locationStore.currentZone → ritualStore.onZoneChange
    const unsubZone = useLocationStore.subscribe(
      (state) => state.currentZone,
      (zone) => {
        useRitualStore.getState().onZoneChange(zone);
      }
    );

    // ritualStore.isActive → uiStore.setHighVisibility
    const unsubActive = useRitualStore.subscribe(
      (state) => state.isActive,
      (isActive) => {
        // Dynamic import to avoid circular deps
        import('../stores/uiStore').then(({ useUIStore }) => {
          useUIStore.getState().setHighVisibility(isActive);
        });
      }
    );

    // ritualStore.currentStepId → uiStore.suppressAllOverlays
    const unsubStep = useRitualStore.subscribe(
      (state) => state.currentStepId,
      (stepId) => {
        import('../stores/uiStore').then(({ useUIStore }) => {
          useUIStore.getState().setSuppressAllOverlays(stepId === 'first_kaaba_sight');
        });
      }
    );

    this.subscriptions = [unsubZone, unsubActive, unsubStep];
  }

  cleanup() {
    for (const unsub of this.subscriptions) {
      unsub();
    }
    this.subscriptions = [];
  }

  getRecoveryState(): RecoveryState {
    return this.evaluate();
  }
}

export const recoveryService = new RecoveryService();
