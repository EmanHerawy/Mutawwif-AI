import { useEffect, useCallback } from 'react';
import { useHealthStore } from '../stores/healthStore';
import { useRitualStore } from '../stores/ritualStore';
import { useUIStore } from '../stores/uiStore';
import {
  fetchMakkahWeather,
  getFallbackHeatStatus,
  shouldSuppressHeatAlert,
  findNearestClinic,
} from '../services/heatSafetyService';
import { useLocationStore } from '../stores/locationStore';

const WEATHER_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY ?? '';

export function useHeatSafety() {
  const { heatStatus, lastHydrationPrompt, setWeatherData, setHeatStatus, logHydrationAlert, acknowledgeHydration, setNearestClinic } =
    useHealthStore();
  const isActive = useRitualStore((s) => s.isActive);
  const suppressAllOverlays = useUIStore((s) => s.suppressAllOverlays);
  const currentZone = useLocationStore((s) => s.currentZone);
  const filteredCoords = useLocationStore((s) => s.filteredCoords);

  const fetchWeather = useCallback(async () => {
    const result = await fetchMakkahWeather(WEATHER_KEY);
    if (result.success) {
      setWeatherData(result.tempCelsius, result.heatIndex);
    } else {
      setHeatStatus(getFallbackHeatStatus());
    }

    // Update nearest clinic
    if (filteredCoords) {
      const clinic = findNearestClinic(filteredCoords, currentZone);
      setNearestClinic(clinic);
    }
  }, [filteredCoords, currentZone, setWeatherData, setHeatStatus, setNearestClinic]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 60 * 1000); // every 60 minutes
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const showHeatAlert = shouldSuppressHeatAlert({
    isRitualActive: isActive,
    suppressAllOverlays,
    lastHydrationPrompt,
  })
    ? false
    : heatStatus === 'danger' || heatStatus === 'extreme';

  const handleDrankWater = useCallback(() => {
    acknowledgeHydration();
  }, [acknowledgeHydration]);

  const handleAlertShown = useCallback(() => {
    logHydrationAlert(null);
  }, [logHydrationAlert]);

  return {
    heatStatus,
    showHeatAlert,
    handleDrankWater,
    handleAlertShown,
    fetchWeather,
  };
}
