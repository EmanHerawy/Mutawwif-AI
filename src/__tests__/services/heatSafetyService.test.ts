import {
  tempToHeatStatus,
  getFallbackHeatStatus,
  shouldSuppressHeatAlert,
  findNearestClinic,
} from '../../services/heatSafetyService';

// ─── tempToHeatStatus ─────────────────────────────────────────────────────

describe('tempToHeatStatus', () => {
  it('returns normal for <35°C', () => {
    expect(tempToHeatStatus(25)).toBe('normal');
    expect(tempToHeatStatus(34)).toBe('normal');
  });

  it('returns caution for 35–39°C', () => {
    expect(tempToHeatStatus(35)).toBe('caution');
    expect(tempToHeatStatus(39)).toBe('caution');
  });

  it('returns danger for 40–44°C', () => {
    expect(tempToHeatStatus(40)).toBe('danger');
    expect(tempToHeatStatus(44)).toBe('danger');
  });

  it('returns extreme for ≥45°C (June Hajj 2026)', () => {
    expect(tempToHeatStatus(45)).toBe('extreme');
    expect(tempToHeatStatus(50)).toBe('extreme');
  });
});

// ─── getFallbackHeatStatus ────────────────────────────────────────────────

describe('getFallbackHeatStatus (network failure)', () => {
  const RealDate = Date;

  function mockMonth(month: number) {
    jest.spyOn(global, 'Date').mockImplementation((...args: unknown[]) => {
      if (args.length) return new RealDate(...(args as ConstructorParameters<typeof Date>));
      const d = new RealDate();
      d.getMonth = () => month;
      return d;
    });
  }

  afterEach(() => jest.restoreAllMocks());

  it('returns danger in June (month 5) — Hajj 2026 safety', () => {
    mockMonth(5); // June
    expect(getFallbackHeatStatus()).toBe('danger');
  });

  it('returns danger in July (month 6)', () => {
    mockMonth(6);
    expect(getFallbackHeatStatus()).toBe('danger');
  });

  it('returns caution in December (off-season)', () => {
    mockMonth(11);
    expect(getFallbackHeatStatus()).toBe('caution');
  });

  it('returns danger in May (month 4)', () => {
    mockMonth(4);
    expect(getFallbackHeatStatus()).toBe('danger');
  });
});

// ─── shouldSuppressHeatAlert ──────────────────────────────────────────────

describe('shouldSuppressHeatAlert', () => {
  it('suppresses when ritual counter is active', () => {
    expect(
      shouldSuppressHeatAlert({
        isRitualActive: true,
        suppressAllOverlays: false,
        lastHydrationPrompt: null,
      })
    ).toBe(true);
  });

  it('suppresses when suppressAllOverlays is true (first Kaaba sight)', () => {
    expect(
      shouldSuppressHeatAlert({
        isRitualActive: false,
        suppressAllOverlays: true,
        lastHydrationPrompt: null,
      })
    ).toBe(true);
  });

  it('suppresses within 20 minutes of last hydration acknowledgment', () => {
    const recentPrompt = new Date(Date.now() - 10 * 60 * 1000); // 10 min ago
    expect(
      shouldSuppressHeatAlert({
        isRitualActive: false,
        suppressAllOverlays: false,
        lastHydrationPrompt: recentPrompt,
      })
    ).toBe(true);
  });

  it('does NOT suppress after 20+ minutes since last hydration', () => {
    const oldPrompt = new Date(Date.now() - 25 * 60 * 1000); // 25 min ago
    expect(
      shouldSuppressHeatAlert({
        isRitualActive: false,
        suppressAllOverlays: false,
        lastHydrationPrompt: oldPrompt,
      })
    ).toBe(false);
  });

  it('does NOT suppress when all conditions are clear', () => {
    expect(
      shouldSuppressHeatAlert({
        isRitualActive: false,
        suppressAllOverlays: false,
        lastHydrationPrompt: null,
      })
    ).toBe(false);
  });
});

// ─── findNearestClinic ────────────────────────────────────────────────────

describe('findNearestClinic', () => {
  it('returns clinic coordinates when inside a known zone', () => {
    const result = findNearestClinic({ latitude: 21.4133, longitude: 39.8933 }, 'mina');
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('latitude');
    expect(result).toHaveProperty('longitude');
  });

  it('returns nearest clinic by distance when zone is null', () => {
    const userInHaram = { latitude: 21.4225, longitude: 39.8262 };
    const result = findNearestClinic(userInHaram, null);
    expect(result).not.toBeNull();
  });
});
