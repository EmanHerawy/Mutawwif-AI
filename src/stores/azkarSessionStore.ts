import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Azkar session store — ephemeral (NOT persisted).
 *
 * Tracks repeat counts per item in the current session.
 * Resets fully when the user starts a new session.
 *
 * Speaker warning rule (CLAUDE.md):
 *   speakerWarningAcknowledged must be true before ANY audio plays.
 *   Reset on every new session start.
 */
interface AzkarSessionState {
  /** id → how many times tapped in this session */
  counters: Record<string, number>;
  sessionActive: boolean;
  speakerWarningAcknowledged: boolean;

  startSession: () => void;
  endSession: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  resetItem: (id: string) => void;
  acknowledgeSpeakerWarning: () => void;
}

export const useAzkarSessionStore = create<AzkarSessionState>()(
  immer((set) => ({
    counters: {},
    sessionActive: false,
    speakerWarningAcknowledged: false,

    startSession: () =>
      set((state) => {
        state.counters = {};
        state.sessionActive = true;
        state.speakerWarningAcknowledged = false; // must re-acknowledge each session
      }),

    endSession: () =>
      set((state) => {
        state.sessionActive = false;
        state.speakerWarningAcknowledged = false;
      }),

    increment: (id) =>
      set((state) => {
        state.counters[id] = (state.counters[id] ?? 0) + 1;
      }),

    decrement: (id) =>
      set((state) => {
        const current = state.counters[id] ?? 0;
        state.counters[id] = Math.max(0, current - 1);
      }),

    resetItem: (id) =>
      set((state) => {
        state.counters[id] = 0;
      }),

    acknowledgeSpeakerWarning: () =>
      set((state) => {
        state.speakerWarningAcknowledged = true;
      }),
  }))
);
