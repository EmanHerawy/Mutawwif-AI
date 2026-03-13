/**
 * End-to-end tests: GPS lap auto-detection
 *
 * Tests the full onZoneChange pipeline:
 *   geofenceService.evaluate(coords) → ritualStore.onZoneChange(zone)
 *
 * This mirrors production:
 *   expo-location → gpsService → gpsFilterService → locationStore.setCurrentZone
 *   → (subscribe) → ritualStore.onZoneChange(zone)
 *
 * NOTE: gpsFilterService's SMA buffer is NOT included here by default.
 * Because Safa (21.4228°N) and Marwa (21.4241°N) are ~550 m apart, the buffer
 * produces a mean coordinate that lands in neither zone after switching.
 * The filter is unit-tested in gpsFilterService.test.ts; here we focus on
 * the zone-detection and lap-counting logic.
 *
 * One dedicated group ("Full GPS pipeline") does exercise gpsFilterService
 * to verify integration with the filter.
 *
 * ---------------------------------------------------------------------------
 * Coordinate reference (VERIFY_COORDINATES — pending field validation):
 *   Kaaba center:            21.4225°N,  39.8262°E
 *   Black Stone (E corner):  21.4223°N,  39.8263°E  ← checkpoint center (r=15m)
 *   Safa platform:           21.4228°N,  39.8256°E  (r=25m)
 *   Marwa platform:          21.4241°N,  39.8308°E  (r=25m)
 * ---------------------------------------------------------------------------
 * Distance analysis for black_stone_checkpoint (r=15m):
 *   < 15 m from E-corner — inner mataf, close walkers         → DETECTED ✓
 *   15–30 m (medium crowd distance)                            → NOT detected (zone limit)
 *   > 30 m — outer mataf edge (~60–80 m from Kaaba)           → NOT detected ✓ (documented)
 *
 * If field testing shows too many misses, increase radiusMeters to 25–30m in haram-zones.ts.
 * ---------------------------------------------------------------------------
 */

import { act } from 'react';
import { gpsFilterService } from '../../services/gpsFilterService';
import { geofenceService } from '../../services/geofenceService';
import { useRitualStore } from '../../stores/ritualStore';
import type { Coordinates, HaramZone } from '../../types/location.types';

// ---------------------------------------------------------------------------
// Real Makkah coordinates
// ---------------------------------------------------------------------------

/** Black Stone checkpoint center — guaranteed zone entry */
const BLACK_STONE: Coordinates = { latitude: 21.4223, longitude: 39.8263 };

/**
 * ~10 m east of Kaaba (inner close-walk path, ~10 m from checkpoint center).
 * Calculated: eastern Kaaba wall at ~39.82626°E; 3 m further east = 39.82640°E
 */
const CLOSE_TAWAF_EAST: Coordinates = { latitude: 21.42225, longitude: 39.82640 };

/**
 * ~27 m from checkpoint center — outside the 15 m checkpoint radius.
 * Represents a "medium crowd" scenario where people walk farther from Kaaba.
 * Documents the known zone-radius limitation.
 */
const MED_TAWAF_EAST: Coordinates = { latitude: 21.42215, longitude: 39.82650 };

/**
 * ~60 m from Kaaba (outer mataf edge). Well outside checkpoint radius.
 */
const OUTER_TAWAF_EAST: Coordinates = { latitude: 21.42200, longitude: 39.82680 };

const TAWAF_NORTH: Coordinates = { latitude: 21.4232, longitude: 39.8262 };
const TAWAF_WEST:  Coordinates = { latitude: 21.4225, longitude: 39.8250 };
const TAWAF_SOUTH: Coordinates = { latitude: 21.4218, longitude: 39.8262 };

const SAFA:    Coordinates = { latitude: 21.4228, longitude: 39.8256 };
const MARWA:   Coordinates = { latitude: 21.4241, longitude: 39.8308 };
const SAI_MID: Coordinates = { latitude: 21.4235, longitude: 39.8280 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetAll() {
  gpsFilterService.reset();
  geofenceService.reset();
  useRitualStore.setState({
    counter: null,
    currentStepId: null,
    steps: [],
    isActive: false,
    trackerPrefs: { autoDetectLaps: false, trackSteps: false, trackTime: false },
    currentLapSteps: 0,
  });
}

/**
 * pipeCoords — bypasses gpsFilterService's SMA buffer.
 * Feeds raw coordinates directly into geofenceService → ritualStore.onZoneChange.
 * Use this for all auto-detect logic tests.
 */
function pipeCoords(coords: Coordinates, count = 4): HaramZone {
  let zone: HaramZone = null;
  for (let i = 0; i < count; i++) {
    zone = geofenceService.evaluate(coords);
    act(() => useRitualStore.getState().onZoneChange(zone));
  }
  return zone;
}

/**
 * pipeGPSFull — runs through the complete pipeline including gpsFilterService.
 * Use only when testing the GPS filter integration.
 * Resets gpsFilterService first to avoid buffer contamination from prior calls.
 */
function pipeGPSFull(coords: Coordinates, count = 4): HaramZone {
  gpsFilterService.reset();
  let zone: HaramZone = null;
  let t = Date.now();
  for (let i = 0; i < count; i++) {
    const reading = gpsFilterService.process(coords, 5, t + i * 1000);
    zone = geofenceService.evaluate(reading.filtered);
    act(() => useRitualStore.getState().onZoneChange(zone));
  }
  return zone;
}

function startWithAutoDetect(ritual: 'tawaf' | 'sai') {
  act(() => useRitualStore.getState().startCounter(ritual));
  act(() => useRitualStore.getState().updateTrackerPrefs({ autoDetectLaps: true }));
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.useFakeTimers();
  resetAll();
});

afterEach(() => {
  jest.useRealTimers();
});

// ===========================================================================
// TAWAF AUTO-DETECT
// ===========================================================================

describe('Tawaf — GPS auto-detect', () => {
  it('increments lap when GPS confirms black_stone_checkpoint entry', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  it('lap is marked gpsValidated=true and autoDetected=true', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);
    const lap = useRitualStore.getState().counter!.lapHistory[0];
    expect(lap.gpsValidated).toBe(true);
    expect(lap.autoDetected).toBe(true);
  });

  it('does NOT count a second crossing within the 60 s debounce window', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);          // lap 1 — records Date.now()
    jest.advanceTimersByTime(30_000);     // only 30 s pass
    pipeCoords(BLACK_STONE, 4);          // still within debounce → no lap
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  it('counts a second lap after the 60 s debounce window expires', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);          // lap 1
    jest.advanceTimersByTime(65_000);     // 65 s pass — debounce expired
    pipeCoords(BLACK_STONE, 4);          // lap 2
    expect(useRitualStore.getState().counter!.completedLaps).toBe(2);
  });

  it('does NOT auto-detect when autoDetectLaps is disabled', () => {
    act(() => useRitualStore.getState().startCounter('tawaf'));
    // autoDetectLaps stays false (default)
    pipeCoords(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('does NOT auto-detect when counter is paused', () => {
    startWithAutoDetect('tawaf');
    act(() => useRitualStore.getState().pauseCounter());
    pipeCoords(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('completes all 7 laps automatically — stops at 7 and deactivates', () => {
    startWithAutoDetect('tawaf');
    for (let i = 0; i < 7; i++) {
      pipeCoords(BLACK_STONE, 4);
      jest.advanceTimersByTime(65_000);  // advance past debounce before next lap
    }
    expect(useRitualStore.getState().counter!.completedLaps).toBe(7);
    expect(useRitualStore.getState().isActive).toBe(false);

    // An 8th crossing must not throw or corrupt state
    pipeCoords(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(7);
  });

  it('simulates a full Tawaf walk: North→West→South→Checkpoint ×7 laps', () => {
    startWithAutoDetect('tawaf');
    for (let lap = 0; lap < 7; lap++) {
      pipeCoords(TAWAF_NORTH, 4);
      pipeCoords(TAWAF_WEST, 4);
      pipeCoords(TAWAF_SOUTH, 4);
      pipeCoords(BLACK_STONE, 4);          // checkpoint crossing
      jest.advanceTimersByTime(65_000);    // next lap past debounce
    }
    expect(useRitualStore.getState().counter!.completedLaps).toBe(7);
    expect(useRitualStore.getState().isActive).toBe(false);
  });

  it('GPS jitter mid-lap does not double-count within debounce window', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);           // lap 1 confirmed
    // Brief jitter: user moves off checkpoint, then back — still within debounce
    jest.advanceTimersByTime(10_000);
    pipeCoords(TAWAF_NORTH, 4);
    jest.advanceTimersByTime(10_000);
    pipeCoords(BLACK_STONE, 4);           // back at checkpoint, still within 60s
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  it('requires exactly 3 consecutive GPS readings to confirm zone entry', () => {
    startWithAutoDetect('tawaf');
    // 2 readings — not confirmed yet
    geofenceService.evaluate(BLACK_STONE);
    act(() => useRitualStore.getState().onZoneChange(geofenceService.evaluate(BLACK_STONE)));
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);

    // Third reading confirms zone → lap fires
    act(() => useRitualStore.getState().onZoneChange(geofenceService.evaluate(BLACK_STONE)));
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  describe('Distance sensitivity — documents detection range vs zone radius', () => {
    it('DETECTS: close Tawaf path (~10 m from checkpoint center)', () => {
      startWithAutoDetect('tawaf');
      pipeCoords(CLOSE_TAWAF_EAST, 4);
      expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
    });

    it('DOES NOT DETECT: ~27 m from checkpoint center (outside 15 m radius) — documents limitation', () => {
      /**
       * A person walking ~20 m from the Kaaba eastern wall is ~27 m from the
       * black_stone_checkpoint center, which is outside the 15 m zone radius.
       * These users will NOT get auto-detection and should use manual tap.
       *
       * Fix: increase radiusMeters in haram-zones.ts from 15 to 25–30 m after
       * field validation confirms the coordinate accuracy.
       */
      startWithAutoDetect('tawaf');
      pipeCoords(MED_TAWAF_EAST, 4);
      expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
    });

    it('DOES NOT DETECT: outer mataf edge (~60 m from Kaaba)', () => {
      startWithAutoDetect('tawaf');
      pipeCoords(OUTER_TAWAF_EAST, 4);
      expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
    });
  });
});

// ===========================================================================
// SA'I AUTO-DETECT
// ===========================================================================

describe("Sa'i — GPS auto-detect", () => {
  it('first platform detection initialises tracking but does NOT count a lap', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('Safa → Marwa counts as lap 1', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);   // init
    pipeCoords(MARWA, 4);  // lap 1
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  it('Safa → Marwa → Safa counts as laps 1 and 2', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);
    pipeCoords(MARWA, 4);
    pipeCoords(SAFA, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(2);
  });

  it('re-entering the same platform does NOT add a lap (no direction change)', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);   // init
    pipeCoords(SAI_MID, 4);
    pipeCoords(SAFA, 4);   // back to Safa — no lap
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('lap record has correct zone, gpsValidated=true, autoDetected=true', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);
    pipeCoords(MARWA, 4);
    const lap = useRitualStore.getState().counter!.lapHistory[0];
    expect(lap.zone).toBe('marwa_platform');
    expect(lap.gpsValidated).toBe(true);
    expect(lap.autoDetected).toBe(true);
  });

  it('does NOT auto-detect when autoDetectLaps is disabled', () => {
    act(() => useRitualStore.getState().startCounter('sai'));
    pipeCoords(SAFA, 4);
    pipeCoords(MARWA, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('does NOT auto-detect when counter is paused', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);  // init
    act(() => useRitualStore.getState().pauseCounter());
    pipeCoords(MARWA, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it("simulates full Sa'i: 7 alternating laps starting from Safa", () => {
    startWithAutoDetect('sai');
    // [0]=init, [1..7]=7 laps: S→M→S→M→S→M→S→M
    const sequence = [SAFA, MARWA, SAFA, MARWA, SAFA, MARWA, SAFA, MARWA];
    for (const p of sequence) {
      pipeCoords(p, 4);
    }
    expect(useRitualStore.getState().counter!.completedLaps).toBe(7);
    expect(useRitualStore.getState().isActive).toBe(false);
  });

  it("Sa'i starting from Marwa also initialises correctly (lap 1 = Marwa → Safa)", () => {
    startWithAutoDetect('sai');
    pipeCoords(MARWA, 4); // init at Marwa
    pipeCoords(SAFA, 4);  // lap 1
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
    const lap = useRitualStore.getState().counter!.lapHistory[0];
    expect(lap.zone).toBe('safa_platform');
  });

  it("GPS readings in the middle of Mas'a corridor do not count as a lap", () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);
    pipeCoords(SAI_MID, 8);  // many readings in middle — no platform
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('each lap records zone of the destination platform', () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);   // init
    pipeCoords(MARWA, 4);  // lap 1 → marwa
    pipeCoords(SAFA, 4);   // lap 2 → safa
    const [lap1, lap2] = useRitualStore.getState().counter!.lapHistory;
    expect(lap1.zone).toBe('marwa_platform');
    expect(lap2.zone).toBe('safa_platform');
  });
});

// ===========================================================================
// FULL GPS PIPELINE (with gpsFilterService)
// ===========================================================================

describe('Full GPS pipeline — gpsFilterService integration', () => {
  it('Tawaf: 4 readings at checkpoint through full filter pipeline → lap counted', () => {
    startWithAutoDetect('tawaf');
    pipeGPSFull(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });

  it('GPS outlier reading (sudden 100 m jump) does not trigger false lap', () => {
    startWithAutoDetect('tawaf');
    // Establish position at black stone
    pipeGPSFull(BLACK_STONE, 3);
    // Sudden GPS outlier — 100 m away
    const outlier: Coordinates = { latitude: 21.4232, longitude: 39.8272 };
    const reading = gpsFilterService.process(outlier, 5, Date.now() + 500);
    // The SMA buffer will reject outliers — filtered coords stay near BLACK_STONE
    const zone = geofenceService.evaluate(reading.filtered);
    act(() => useRitualStore.getState().onZoneChange(zone));
    // Counter should still be at 1 (the 3 previous readings already fired the lap)
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });
});

// ===========================================================================
// STATE RESET
// ===========================================================================

describe('State reset between rituals', () => {
  it("resetting clears Sa'i zone tracking — fresh start from any platform", () => {
    startWithAutoDetect('sai');
    pipeCoords(SAFA, 4);  // init lastSaiZone = safa
    act(() => useRitualStore.getState().resetCounter());

    // Reset geofenceService too — mirrors production: user walks away from Safa
    // before starting a new counter, so the geofence naturally exits the zone.
    geofenceService.reset();

    startWithAutoDetect('sai');
    // After reset, Marwa should be treated as fresh init (not a crossing from Safa)
    pipeCoords(MARWA, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(0);
  });

  it('resetting clears Tawaf debounce — first checkpoint entry counts immediately', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);  // lap 1
    act(() => useRitualStore.getState().resetCounter());

    startWithAutoDetect('tawaf');
    // Immediately after reset, debounce is gone — crossing counts
    pipeCoords(BLACK_STONE, 4);
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
  });
});

// ===========================================================================
// MANUAL TAP COEXISTS WITH AUTO-DETECT
// ===========================================================================

describe('Manual tap + auto-detect coexistence', () => {
  it('manual tap works when autoDetectLaps is enabled', () => {
    startWithAutoDetect('tawaf');
    act(() => useRitualStore.getState().incrementLap(null as any, false, false));
    expect(useRitualStore.getState().counter!.completedLaps).toBe(1);
    expect(useRitualStore.getState().counter!.lapHistory[0].autoDetected).toBeUndefined();
  });

  it('manual tap then auto-detect: both increment independently', () => {
    startWithAutoDetect('tawaf');
    act(() => useRitualStore.getState().incrementLap(null as any, false, false)); // manual lap 1
    jest.advanceTimersByTime(65_000);
    pipeCoords(BLACK_STONE, 4);  // auto lap 2
    expect(useRitualStore.getState().counter!.completedLaps).toBe(2);
    expect(useRitualStore.getState().counter!.lapHistory[1].autoDetected).toBe(true);
  });

  it('auto-detect then manual tap: manual is not blocked', () => {
    startWithAutoDetect('tawaf');
    pipeCoords(BLACK_STONE, 4);  // auto lap 1
    // Manual tap within debounce window — should still work (manual bypass)
    act(() => useRitualStore.getState().incrementLap(null as any, false, false));
    expect(useRitualStore.getState().counter!.completedLaps).toBe(2);
  });
});
