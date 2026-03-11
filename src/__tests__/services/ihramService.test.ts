import { ihramService } from '../../services/ihramService';

describe('ihramService — state machine', () => {
  // ─── confirmIhram ──────────────────────────────────────────────────────
  describe('confirmIhram', () => {
    it('transitions not_worn → active', () => {
      const result = ihramService.confirmIhram('not_worn');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('active');
    });

    it('rejects transition from active → active (already active)', () => {
      const result = ihramService.confirmIhram('active');
      expect(result.success).toBe(false);
      expect(result.newState).toBe('active');
    });

    it('rejects transition from released → active', () => {
      const result = ihramService.confirmIhram('released');
      expect(result.success).toBe(false);
    });
  });

  // ─── confirmRetroactive ────────────────────────────────────────────────
  describe('confirmRetroactive (wore Ihram on plane)', () => {
    it('transitions not_worn → active and clears alreadyCrossed', () => {
      const result = ihramService.confirmRetroactive('not_worn', 'al_juhfah');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('active');
      expect(result.clearAlreadyCrossed).toBe(true);
    });

    it('transitions crossed_without_ihram → active (resolution path)', () => {
      const result = ihramService.confirmRetroactive('crossed_without_ihram', 'al_juhfah');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('active');
      expect(result.clearAlreadyCrossed).toBe(true);
    });

    it('rejects retroactive for released state', () => {
      const result = ihramService.confirmRetroactive('released', 'al_juhfah');
      expect(result.success).toBe(false);
    });
  });

  // ─── flagCrossedWithoutIhram ───────────────────────────────────────────
  describe('flagCrossedWithoutIhram', () => {
    it('transitions not_worn → crossed_without_ihram', () => {
      const result = ihramService.flagCrossedWithoutIhram('not_worn');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('crossed_without_ihram');
    });

    it('cannot flag active Ihram as crossed (guard)', () => {
      const result = ihramService.flagCrossedWithoutIhram('active');
      expect(result.success).toBe(false);
      expect(result.newState).toBe('active');
    });
  });

  // ─── releaseIhram ─────────────────────────────────────────────────────
  describe('releaseIhram', () => {
    it('transitions active → released after ritual complete', () => {
      const result = ihramService.releaseIhram('active');
      expect(result.success).toBe(true);
      expect(result.newState).toBe('released');
    });

    it('cannot release not_worn state', () => {
      const result = ihramService.releaseIhram('not_worn');
      expect(result.success).toBe(false);
    });
  });

  // ─── acknowledgeScholarConsultation ───────────────────────────────────
  describe('acknowledgeScholarConsultation', () => {
    it('always clears alreadyCrossed regardless of state', () => {
      const result = ihramService.acknowledgeScholarConsultation('crossed_without_ihram');
      expect(result.clearAlreadyCrossed).toBe(true);
    });
  });
});
