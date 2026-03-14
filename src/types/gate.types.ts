export type GateStatus = 'open' | 'crowded' | 'full' | 'closed';
export type GateDataSource = 'mock' | 'live' | 'cache';
export type MosqueType = 'haram' | 'nabawi';

export interface GateInfo {
  id: string;
  nameAr: string;
  nameEn: string;
  number?: number;
  wing: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  status: GateStatus;
  accessible: boolean;
  mosque: MosqueType;
  notes?: string;
  /** Approximate coordinates — VERIFY_COORDINATES before production */
  lat?: number;
  lng?: number;
}

export interface GateFetchResult {
  gates: GateInfo[];
  dataSource: GateDataSource;
  fetchedAt: string; // ISO
}
