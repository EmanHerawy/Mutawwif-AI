import { toDate, toDateOrNull } from '../../utils/dateUtils';

describe('toDate', () => {
  it('returns the same Date instance when passed a Date', () => {
    const d = new Date('2026-03-13T10:00:00Z');
    expect(toDate(d)).toBe(d);
  });

  it('parses an ISO string into a Date', () => {
    const iso = '2026-03-13T10:00:00.000Z';
    const result = toDate(iso);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe(iso);
  });

  it('returns a valid Date (now) when passed an invalid string', () => {
    const before = Date.now();
    const result = toDate('not-a-date');
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
  });

  it('handles null by returning a Date (now)', () => {
    const result = toDate(null);
    expect(result).toBeInstanceOf(Date);
  });
});

describe('toDateOrNull', () => {
  it('returns null for null', () => {
    expect(toDateOrNull(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(toDateOrNull(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(toDateOrNull('')).toBeNull();
  });

  it('returns the same Date instance when passed a Date', () => {
    const d = new Date('2026-03-13T10:00:00Z');
    expect(toDateOrNull(d)).toBe(d);
  });

  it('parses an ISO string into a Date', () => {
    const iso = '2026-01-15T08:30:00.000Z';
    const result = toDateOrNull(iso);
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toBe(iso);
  });

  it('returns null for an invalid string', () => {
    expect(toDateOrNull('not-a-date')).toBeNull();
  });
});

describe('Date rehydration — ritualStore scenario', () => {
  it('converts persisted ISO strings back to Date on a simulated counter object', () => {
    const raw = {
      lastSavedAt: '2026-03-13T09:00:00.000Z',
      pausedAt: null,
      lapHistory: [
        {
          lapNumber: 1,
          startTime: '2026-03-13T08:00:00.000Z',
          endTime: '2026-03-13T08:10:00.000Z',
          durationMs: 600_000,
          zone: 'mataf_ground',
          gpsValidated: false,
        },
      ],
    };

    const lastSavedAt = toDate(raw.lastSavedAt);
    const pausedAt = toDateOrNull(raw.pausedAt);
    const laps = raw.lapHistory.map((l) => ({
      ...l,
      startTime: toDate(l.startTime),
      endTime: toDateOrNull(l.endTime),
    }));

    expect(lastSavedAt).toBeInstanceOf(Date);
    expect(lastSavedAt.getFullYear()).toBe(2026);
    expect(pausedAt).toBeNull();
    expect(laps[0].startTime).toBeInstanceOf(Date);
    expect(laps[0].endTime).toBeInstanceOf(Date);
    // durationMs recalculation should still work after coercion
    expect(laps[0].endTime!.getTime() - laps[0].startTime.getTime()).toBe(600_000);
  });
});
