import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { gateStatusService } from '../services/gateStatusService';
import type { GateInfo, GateDataSource, MosqueType } from '../types/gate.types';

interface GateState {
  haramGates: GateInfo[];
  nabawiGates: GateInfo[];
  haramDataSource: GateDataSource | null;
  nabawiDataSource: GateDataSource | null;
  haramFetchedAt: string | null;
  nabawiAFetchedAt: string | null;
  loading: boolean;
  fetchHaram: () => Promise<void>;
  fetchNabawi: () => Promise<void>;
}

export const useGateStore = create<GateState>()(
  immer((set) => ({
    haramGates: [],
    nabawiGates: [],
    haramDataSource: null,
    nabawiDataSource: null,
    haramFetchedAt: null,
    nabawiAFetchedAt: null,
    loading: false,

    fetchHaram: async () => {
      set((state) => {
        state.loading = true;
      });
      const result = await gateStatusService.fetchGates('haram' as MosqueType);
      set((state) => {
        state.haramGates = result.gates;
        state.haramDataSource = result.dataSource;
        state.haramFetchedAt = result.fetchedAt;
        state.loading = false;
      });
    },

    fetchNabawi: async () => {
      set((state) => {
        state.loading = true;
      });
      const result = await gateStatusService.fetchGates('nabawi' as MosqueType);
      set((state) => {
        state.nabawiGates = result.gates;
        state.nabawiDataSource = result.dataSource;
        state.nabawiAFetchedAt = result.fetchedAt;
        state.loading = false;
      });
    },
  }))
);
