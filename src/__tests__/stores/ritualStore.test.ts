import { act } from 'react';
import { useRitualStore } from '../../stores/ritualStore';

function getStore() {
  return useRitualStore.getState();
}

beforeEach(() => {
  useRitualStore.setState({
    counter: null,
    currentStepId: null,
    steps: [],
    isActive: false,
  });
});

describe('ritualStore — startCounter', () => {
  it('initialises counter with correct defaults', () => {
    act(() => getStore().startCounter('tawaf'));
    const { counter, isActive } = getStore();
    expect(counter).not.toBeNull();
    expect(counter!.ritual).toBe('tawaf');
    expect(counter!.completedLaps).toBe(0);
    expect(counter!.currentLap).toBe(1);
    expect(counter!.totalLaps).toBe(7);
    expect(counter!.isPaused).toBe(false);
    expect(isActive).toBe(true);
  });
});

describe('ritualStore — incrementLap', () => {
  it('increments completedLaps by 1', () => {
    act(() => getStore().startCounter('tawaf'));
    act(() => getStore().incrementLap('mataf_ground', true));
    expect(getStore().counter!.completedLaps).toBe(1);
    expect(getStore().counter!.currentLap).toBe(2);
  });

  it('records lap in lapHistory', () => {
    act(() => getStore().startCounter('tawaf'));
    act(() => getStore().incrementLap('mataf_ground', true));
    expect(getStore().counter!.lapHistory).toHaveLength(1);
    expect(getStore().counter!.lapHistory[0].lapNumber).toBe(1);
    expect(getStore().counter!.lapHistory[0].zone).toBe('mataf_ground');
    expect(getStore().counter!.lapHistory[0].gpsValidated).toBe(true);
  });

  it('auto-completes at lap 7', () => {
    act(() => getStore().startCounter('tawaf'));
    for (let i = 0; i < 7; i++) {
      act(() => getStore().incrementLap('mataf_ground', false));
    }
    expect(getStore().counter!.completedLaps).toBe(7);
    expect(getStore().isActive).toBe(false);
    expect(getStore().counter!.isActive).toBe(false);
  });

  it('does nothing when counter is inactive', () => {
    act(() => getStore().incrementLap('mataf_ground', false));
    expect(getStore().counter).toBeNull();
  });
});

describe('ritualStore — pause/resume', () => {
  it('pauses and sets pausedAt', () => {
    act(() => getStore().startCounter('sai'));
    act(() => getStore().pauseCounter());
    expect(getStore().counter!.isPaused).toBe(true);
    expect(getStore().counter!.pausedAt).not.toBeNull();
  });

  it('resumes and clears pausedAt', () => {
    act(() => getStore().startCounter('sai'));
    act(() => getStore().pauseCounter());
    act(() => getStore().resumeCounter());
    expect(getStore().counter!.isPaused).toBe(false);
    expect(getStore().counter!.pausedAt).toBeNull();
  });
});

describe('ritualStore — markComplete', () => {
  it('sets completedLaps to 7 and deactivates', () => {
    act(() => getStore().startCounter('tawaf'));
    act(() => getStore().incrementLap('mataf_ground', false)); // only 1 lap
    act(() => getStore().markComplete());
    expect(getStore().counter!.completedLaps).toBe(7);
    expect(getStore().isActive).toBe(false);
  });
});

describe('ritualStore — resetCounter', () => {
  it('clears counter and sets isActive false', () => {
    act(() => getStore().startCounter('tawaf'));
    act(() => getStore().resetCounter());
    expect(getStore().counter).toBeNull();
    expect(getStore().isActive).toBe(false);
  });
});

describe('ritualStore — resumeFrom (crash recovery)', () => {
  it('restores saved counter state', () => {
    const savedCounter = {
      ritual: 'tawaf' as const,
      totalLaps: 7 as const,
      completedLaps: 5,
      currentLap: 6,
      isPaused: false,
      pausedAt: null,
      lapHistory: [],
      startDirectionValidated: true,
      lastSavedAt: new Date(),
      isActive: true,
    };
    act(() => getStore().resumeFrom(savedCounter));
    expect(getStore().counter!.completedLaps).toBe(5);
    expect(getStore().counter!.currentLap).toBe(6);
    expect(getStore().isActive).toBe(true);
  });
});
