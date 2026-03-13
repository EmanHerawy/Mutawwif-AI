import { HARAM_GATES_MOCK } from '../data/haram-gates-mock';
import { NABAWI_GATES_MOCK } from '../data/nabawi-gates-mock';
import type { GateFetchResult, MosqueType } from '../types/gate.types';

// Provider pattern per CLAUDE.md:
// EXPO_PUBLIC_GATE_API_URL → ExternalGateApiProvider (future)
// EXPO_PUBLIC_USE_FIREBASE_GATES → FirebaseGateProvider (future)
// Default → MockGateProvider

class MockGateProvider {
  fetch(mosque: MosqueType): GateFetchResult {
    const gates = mosque === 'haram' ? HARAM_GATES_MOCK : NABAWI_GATES_MOCK;
    return {
      gates,
      dataSource: 'mock',
      fetchedAt: new Date().toISOString(),
    };
  }
}

class GateStatusService {
  private mockProvider = new MockGateProvider();

  async fetchGates(mosque: MosqueType): Promise<GateFetchResult> {
    // Future: check env vars and delegate to external/firebase provider
    // For now: always MockGateProvider
    return this.mockProvider.fetch(mosque);
  }
}

export const gateStatusService = new GateStatusService();
