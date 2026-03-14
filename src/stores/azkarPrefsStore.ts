import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Azkar display preferences + favorites — persisted across sessions.
 */
interface AzkarPrefsState {
  showTranslation: boolean;
  showTransliteration: boolean;
  showArabicText: boolean;
  favoriteIds: string[];
  etiquetteFavoriteIds: string[];

  toggleTranslation: () => void;
  toggleTransliteration: () => void;
  toggleArabicText: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleEtiquetteFavorite: (id: string) => void;
  isEtiquetteFavorite: (id: string) => boolean;
}

export const useAzkarPrefsStore = create<AzkarPrefsState>()(
  persist(
    immer((set, get) => ({
      showTranslation: true,
      showTransliteration: true,
      showArabicText: true,
      favoriteIds: [],
      etiquetteFavoriteIds: [],

      toggleTranslation: () =>
        set((state) => { state.showTranslation = !state.showTranslation; }),

      toggleTransliteration: () =>
        set((state) => { state.showTransliteration = !state.showTransliteration; }),

      toggleArabicText: () =>
        set((state) => { state.showArabicText = !state.showArabicText; }),

      toggleFavorite: (id) =>
        set((state) => {
          const idx = state.favoriteIds.indexOf(id);
          if (idx >= 0) {
            state.favoriteIds.splice(idx, 1);
          } else {
            state.favoriteIds.push(id);
          }
        }),

      isFavorite: (id) => get().favoriteIds.includes(id),

      toggleEtiquetteFavorite: (id) =>
        set((state) => {
          const idx = state.etiquetteFavoriteIds.indexOf(id);
          if (idx >= 0) {
            state.etiquetteFavoriteIds.splice(idx, 1);
          } else {
            state.etiquetteFavoriteIds.push(id);
          }
        }),

      isEtiquetteFavorite: (id) => get().etiquetteFavoriteIds.includes(id),
    })),
    {
      name: 'azkar-prefs-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
