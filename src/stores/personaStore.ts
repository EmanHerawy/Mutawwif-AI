import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PersonaModel } from '../types/persona.types';

interface PersonaState {
  persona: PersonaModel | null;
  isOnboardingComplete: boolean;
  setPersona: (persona: PersonaModel) => void;
  updatePersona: (partial: Partial<PersonaModel>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    immer((set) => ({
      persona: null,
      isOnboardingComplete: false,

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
    })),
    {
      name: 'persona-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
