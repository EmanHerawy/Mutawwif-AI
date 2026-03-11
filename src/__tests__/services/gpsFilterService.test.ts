import {
  mapAccuracyToConfidence,
  haversineMeters,
  haversineKm,
  gpsFilterService,
} from '../../services/gpsFilterService';

beforeEach(() => {
  gpsFilterService.reset();
});

// ─── mapAccuracyToConfidence ───────────────────────────────────────────────

describe('mapAccuracyToConfidence', () => {
  it('returns 1.0 for ≤5m accuracy', () => {
    expect(mapAccuracyToConfidence(3)).toBe(1.0);
    expect(mapAccuracyToConfidence(5)).toBe(1.0);
  });

  it('returns 0.85 for ≤10m', () => {
    expect(mapAccuracyToConfidence(7)).toBe(0.85);
    expect(mapAccuracyToConfidence(10)).toBe(0.85);
  });

  it('returns 0.7 for ≤15m', () => {
    expect(mapAccuracyToConfidence(12)).toBe(0.7);
  });

  it('returns 0.55 for ≤20m', () => {
    expect(mapAccuracyToConfidence(18)).toBe(0.55);
  });

  it('returns 0.4 for ≤30m', () => {
    expect(mapAccuracyToConfidence(25)).toBe(0.4);
  });

  it('returns 0.2 for ≤50m', () => {
    expect(mapAccuracyToConfidence(40)).toBe(0.2);
  });

  it('returns 0.0 for >50m (forces manual mode)', () => {
    expect(mapAccuracyToConfidence(51)).toBe(0.0);
    expect(mapAccuracyToConfidence(200)).toBe(0.0);
  });
});

// ─── haversine ─────────────────────────────────────────────────────────────

describe('haversineMeters', () => {
  it('returns 0 for identical coordinates', () => {
    const coord = { latitude: 21.4225, longitude: 39.8262 };
    expect(haversineMeters(coord, coord)).toBeCloseTo(0, 1);
  });

  it('correctly measures ~111km per degree of latitude', () => {
    const a = { latitude: 0, longitude: 0 };
    const b = { latitude: 1, longitude: 0 };
    expect(haversineMeters(a, b)).toBeCloseTo(111195, -2); // within 100m
  });

  it('measures distance between Kaaba and Safa platform (~160m)', () => {
    const kaaba = { latitude: 21.4225, longitude: 39.8262 };
    const safa = { latitude: 21.4228, longitude: 39.8256 };
    const dist = haversineMeters(kaaba, safa);
    expect(dist).toBeGreaterThan(50);
    expect(dist).toBeLessThan(300);
  });
});

describe('haversineKm', () => {
  it('converts meters to km correctly', () => {
    const a = { latitude: 0, longitude: 0 };
    const b = { latitude: 1, longitude: 0 };
    expect(haversineKm(a, b)).toBeCloseTo(111.195, 0);
  });
});

// ─── gpsFilterService.process ──────────────────────────────────────────────

describe('gpsFilterService.process', () => {
  const now = Date.now();
  const baseCoord = { latitude: 21.4225, longitude: 39.8262 };

  it('accepts first reading into buffer', () => {
    const result = gpsFilterService.process(baseCoord, 10, now);
    expect(result.isOutlier).toBe(false);
    expect(result.confidence).toBe(0.85);
    expect(result.filtered).toMatchObject({
      latitude: expect.closeTo(21.4225, 4),
      longitude: expect.closeTo(39.8262, 4),
    });
  });

  it('rejects outlier: >50m jump in <3 seconds', () => {
    gpsFilterService.process(baseCoord, 10, now);
    // ~800m north — clear outlier
    const outlier = { latitude: 21.4297, longitude: 39.8262 };
    const result = gpsFilterService.process(outlier, 10, now + 1000);
    expect(result.isOutlier).toBe(true);
  });

  it('accepts large jump if >3 seconds have passed (user moved)', () => {
    gpsFilterService.process(baseCoord, 10, now);
    const farCoord = { latitude: 21.4297, longitude: 39.8262 };
    const result = gpsFilterService.process(farCoord, 10, now + 4000);
    expect(result.isOutlier).toBe(false);
  });

  it('SMA: filtered coord is average of buffer', () => {
    const t = Date.now();
    const coords = [
      { latitude: 21.4220, longitude: 39.8260 },
      { latitude: 21.4222, longitude: 39.8262 },
      { latitude: 21.4224, longitude: 39.8264 },
    ];
    // Space readings >3s apart so none are outliers
    for (let i = 0; i < coords.length; i++) {
      gpsFilterService.process(coords[i], 5, t + i * 4000);
    }
    const last = gpsFilterService.process(
      { latitude: 21.4226, longitude: 39.8266 },
      5,
      t + 16000
    );
    // Filtered should be near the mean of all 4
    expect(last.filtered.latitude).toBeCloseTo(21.4223, 3);
  });

  it('sets confidence to 0 for accuracy >50m', () => {
    const result = gpsFilterService.process(baseCoord, 60, now);
    expect(result.confidence).toBe(0.0);
  });

  it('isLowConfidenceFor30Seconds returns true after 30s of low confidence', () => {
    const t = Date.now();
    gpsFilterService.process(baseCoord, 60, t); // confidence 0 → low
    expect(gpsFilterService.isLowConfidenceFor30Seconds(t + 29000)).toBe(false);
    expect(gpsFilterService.isLowConfidenceFor30Seconds(t + 31000)).toBe(true);
  });

  it('resets low confidence timer when good reading arrives', () => {
    const t = Date.now();
    gpsFilterService.process(baseCoord, 60, t); // bad
    gpsFilterService.process(baseCoord, 5, t + 4000); // good — resets timer
    gpsFilterService.process(baseCoord, 60, t + 8000); // bad again
    // Only 1s of low confidence since last good reading
    expect(gpsFilterService.isLowConfidenceFor30Seconds(t + 9000)).toBe(false);
  });
});
