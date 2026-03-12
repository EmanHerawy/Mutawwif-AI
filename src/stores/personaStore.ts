import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersonaModel } from '../types/persona.types';

interface PersonaState {
  persona: PersonaModel | null;
  isOnboardingComplete: boolean;
  _hydrated: boolean;
  setPersona: (persona: PersonaModel) => void;
  updatePersona: (partial: Partial<PersonaModel>) => void;
  completeOnboarding: () => void;
  reset: () => void;
  _setHydrated: () => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    immer((set) => ({
      persona: null,
      isOnboardingComplete: false,
      _hydrated: false,

      setPersona: (persona) =>
        set((state) => {
          state.persona = persona;
        }),

      updatePersona: (partial) =>
        set((state) => {
          if (state.persona) {
            Object.assign(state.persona, partial);
          }
        }),

      completeOnboarding: () =>
        set((state) => {
          state.isOnboardingComplete = true;
        }),

      reset: () =>
        set((state) => {
          state.persona = null;
          state.isOnboardingComplete = false;
        }),

      _setHydrated: () =>
        set((state) => {
          state._hydrated = true;
        }),
    })),
    {
      name: 'persona-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        persona: state.persona,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    }
  )
);
