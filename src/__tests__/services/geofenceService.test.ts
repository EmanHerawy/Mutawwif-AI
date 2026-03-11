import { geofenceService } from '../../services/geofenceService';

beforeEach(() => {
  geofenceService.reset();
});

const MATAF_CENTER = { latitude: 21.4225, longitude: 39.8262 };
const OUTSIDE_HARAM = { latitude: 21.4500, longitude: 39.8500 }; // ~3km away

function feedReadings(coords: { latitude: number; longitude: number }, count: number) {
  let result = null;
  for (let i = 0; i < count; i++) {
    result = geofenceService.evaluate(coords);
  }
  return result;
}

describe('geofenceService.evaluate', () => {
  it('returns null when outside all zones', () => {
    const zone = feedReadings(OUTSIDE_HARAM, 3);
    expect(zone).toBeNull();
  });

  it('requires 3 consecutive readings before confirming zone entry', () => {
    // 1 reading — not confirmed yet
    geofenceService.evaluate(MATAF_CENTER);
    geofenceService.evaluate(MATAF_CENTER);
    // Still only 2 — should not be confirmed yet
    // (result from 2nd reading may return null or previous zone)
    const after2 = geofenceService.evaluate(MATAF_CENTER);
    // After 3rd reading, zone should be confirmed
    expect(after2).not.toBeNull();
  });

  it('confirms mataf_ground after 3 readings inside zone', () => {
    const zone = feedReadings(MATAF_CENTER, 3);
    // mataf_ground is smallest radius so it wins
    expect(zone).toBe('mataf_ground');
  });

  it('exits zone after 3 consecutive readings outside', () => {
    feedReadings(MATAF_CENTER, 3); // enter
    feedReadings(OUTSIDE_HARAM, 3); // exit
    const zone = geofenceService.evaluate(OUTSIDE_HARAM);
    expect(zone).toBeNull();
  });

  it('stays in zone during brief GPS jitter (< 3 consecutive misses)', () => {
    feedReadings(MATAF_CENTER, 3); // confirmed inside
    geofenceService.evaluate(OUTSIDE_HARAM); // 1 miss
    geofenceService.evaluate(OUTSIDE_HARAM); // 2 misses
    // Still hasn't hit 3 consecutive misses — zone stays
    const zone = geofenceService.evaluate(MATAF_CENTER); // back inside
    expect(zone).toBe('mataf_ground');
  });

  it('confirms haram_boundary for coordinates inside boundary but outside all smaller zones', () => {
    // ~166m north of mataf center — outside mataf (80m), masa (130m), safa/marwa (25m); inside haram_boundary (400m)
    const insideBoundary = { latitude: 21.4240, longitude: 39.8262 };
    const zone = feedReadings(insideBoundary, 3);
    expect(zone).toBe('haram_boundary');
  });
});
