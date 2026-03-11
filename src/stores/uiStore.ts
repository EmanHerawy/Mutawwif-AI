import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
  themeMode: ThemeMode;
  isHighVisibility: boolean;
  fontSize: number;           // 18–28
  suppressAllOverlays: boolean; // true only during first_kaaba_sight step
  isDarkMode: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setHighVisibility: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setSuppressAllOverlays: (suppress: boolean) => void;
  setDarkMode: (dark: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      themeMode: 'system',
      isHighVisibility: false,
      fontSize: 18,
      suppressAllOverlays: false,
      isDarkMode: false,

      setThemeMode: (mode) =>
        set((state) => {
          state.themeMode = mode;
        }),

      setHighVisibility: (enabled) =>
        set((state) => {
          state.isHighVisibility = enabled;
        }),

      setFontSize: (size) =>
        set((state) => {
          state.fontSize = Math.min(28, Math.max(18, size));
        }),

      setSuppressAllOverlays: (suppress) =>
        set((state) => {
          state.suppressAllOverlays = suppress;
        }),

      setDarkMode: (dark) =>
        set((state) => {
          state.isDarkMode = dark;
        }),
    })),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        isHighVisibility: state.isHighVisibility,
        fontSize: state.fontSize,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
