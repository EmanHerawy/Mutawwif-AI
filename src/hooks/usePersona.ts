import { usePersonaStore } from '../stores/personaStore';
import type { PersonaModel } from '../types/persona.types';

export function usePersona() {
  const persona = usePersonaStore((s) => s.persona);
  const isOnboardingComplete = usePersonaStore((s) => s.isOnboardingComplete);
  const { setPersona, updatePersona, completeOnboarding } = usePersonaStore.getState();

  const isFemale = persona?.gender === 'female';
  const isMale = persona?.gender === 'male';

  return {
    persona,
    isOnboardingComplete,
    isFemale,
    isMale,
    setPersona,
    updatePersona,
    completeOnboarding,
  };
}
