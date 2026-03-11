import { act } from 'react';
import { useHealthStore } from '../../stores/healthStore';

function getStore() {
  return useHealthStore.getState();
}

beforeEach(() => {
  useHealthStore.setState({
    currentTempCelsius: null,
    heatIndex: null,
    lastWeatherFetch: null,
    hydrationAlertsToday: 0,
    lastHydrationPrompt: null,
    nearestClinicCoords: null,
    heatStatus: 'normal',
    hydrationLog: [],
  });
});

describe('healthStore — setWeatherData', () => {
  it('sets normal for <35°C', () => {
    act(() => getStore().setWeatherData(30, 32));
    expect(getStore().heatStatus).toBe('normal');
    expect(getStore().currentTempCelsius).toBe(30);
  });

  it('sets caution for 35–39°C', () => {
    act(() => getStore().setWeatherData(37, 39));
    expect(getStore().heatStatus).toBe('caution');
  });

  it('sets danger for 40–44°C', () => {
    act(() => getStore().setWeatherData(42, 44));
    expect(getStore().heatStatus).toBe('danger');
  });

  it('sets extreme for ≥45°C', () => {
    act(() => getStore().setWeatherData(46, 48));
    expect(getStore().heatStatus).toBe('extreme');
  });

  it('updates lastWeatherFetch timestamp', () => {
    act(() => getStore().setWeatherData(30, 32));
    expect(getStore().lastWeatherFetch).not.toBeNull();
  });
});

describe('healthStore — hydration tracking', () => {
  it('increments hydrationAlertsToday on logHydrationAlert', () => {
    act(() => getStore().logHydrationAlert(null));
    act(() => getStore().logHydrationAlert('tawaf_lap_3'));
    expect(getStore().hydrationAlertsToday).toBe(2);
    expect(getStore().hydrationLog).toHaveLength(2);
  });

  it('stores ritualId on hydration log entry', () => {
    act(() => getStore().logHydrationAlert('sai'));
    expect(getStore().hydrationLog[0].ritualId).toBe('sai');
  });

  it('sets lastHydrationPrompt on acknowledgeHydration', () => {
    act(() => getStore().acknowledgeHydration());
    expect(getStore().lastHydrationPrompt).not.toBeNull();
  });

  it('resets daily counters', () => {
    act(() => getStore().logHydrationAlert(null));
    act(() => getStore().logHydrationAlert(null));
    act(() => getStore().resetDailyCounters());
    expect(getStore().hydrationAlertsToday).toBe(0);
    expect(getStore().hydrationLog).toHaveLength(0);
  });
});

describe('healthStore — nearest clinic', () => {
  it('stores nearest clinic coordinates', () => {
    const coords = { latitude: 21.4133, longitude: 39.8933 };
    act(() => getStore().setNearestClinic(coords));
    expect(getStore().nearestClinicCoords).toEqual(coords);
  });

  it('clears nearest clinic', () => {
    act(() => getStore().setNearestClinic(null));
    expect(getStore().nearestClinicCoords).toBeNull();
  });
});
