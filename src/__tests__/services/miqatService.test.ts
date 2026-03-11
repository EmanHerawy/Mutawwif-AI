import { miqatService } from '../../services/miqatService';

beforeEach(() => {
  miqatService.reset();
});

const KAABA = { latitude: 21.4225, longitude: 39.8262 };

// Simulate a series of positions approaching Makkah from the north
// (Dhul Hulayfah direction — Madinah pilgrims)
const MADINAH_APPROACH = [
  { latitude: 24.8, longitude: 39.5 },  // far north, approaching
  { latitude: 24.5, longitude: 39.5 },  // closer
  { latitude: 24.1, longitude: 39.5 },  // near Dhul Hulayfah
];

describe('miqatService.evaluate — Jeddah airport special case', () => {
  it('flags Jeddah airport coordinates', () => {
    miqatService.reset();
    // Warm up distance tracker with approach
    miqatService.evaluate({ latitude: 22.0, longitude: 39.5 });
    const result = miqatService.evaluate({ latitude: 21.6796, longitude: 39.1565 });
    expect(result.isJeddahAirport).toBe(true);
  });

  it('does not flag non-Jeddah coordinates', () => {
    const result = miqatService.evaluate(KAABA);
    expect(result.isJeddahAirport).toBe(false);
  });
});

describe('miqatService.evaluate — Miqat assignment', () => {
  it('assigns nearest Miqat for Madinah-origin pilgrim', () => {
    const result = miqatService.evaluate({ latitude: 24.4136, longitude: 39.5354 });
    // Dhul Hulayfah is the closest Miqat to Madinah
    expect(result.assignedMiqat).toBe('dhul_hulayfah');
  });

  it('assigns Al-Juhfah for a pilgrim coming from the west', () => {
    const result = miqatService.evaluate({ latitude: 22.7964, longitude: 39.0339 });
    expect(result.assignedMiqat).toBe('al_juhfah');
  });
});

describe('miqatService.evaluate — bearing validation', () => {
  it('suppresses alert when pilgrim is moving AWAY from Makkah', () => {
    // Simulate moving away: start near Makkah, move north
    miqatService.evaluate({ latitude: 22.0, longitude: 39.5 }); // closer
    const result = miqatService.evaluate({ latitude: 23.5, longitude: 39.5 }); // farther
    // approachingMakkah should be false (distance increased significantly)
    expect(result.approachingMakkah).toBe(false);
    expect(result.shouldAlert50km).toBe(false);
    expect(result.shouldAlert10km).toBe(false);
  });

  it('allows alert when pilgrim is approaching Makkah', () => {
    // Start far, move closer
    miqatService.evaluate({ latitude: 24.8, longitude: 39.5 }); // very far
    miqatService.evaluate({ latitude: 24.0, longitude: 39.5 }); // closer — warms up
    const result = miqatService.evaluate({ latitude: 23.5, longitude: 39.5 }); // closer still
    expect(result.approachingMakkah).toBe(true);
  });
});

describe('miqatService.evaluate — alert thresholds', () => {
  it('does not alert when very far from Miqat (>50km)', () => {
    // Cairo-like position — very far from any Miqat
    miqatService.evaluate({ latitude: 30.0, longitude: 31.0 }); // warm up
    const result = miqatService.evaluate({ latitude: 29.0, longitude: 32.0 });
    expect(result.shouldAlert50km).toBe(false);
    expect(result.shouldAlert10km).toBe(false);
    expect(result.shouldAlertArrival).toBe(false);
  });
});
