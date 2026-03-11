import type { HeatStatus } from '../types/health.types';
import type { Coordinates } from '../types/location.types';
import { HEALTH_CLINICS } from '../data/health-clinics';
import { haversineMeters } from './gpsFilterService';

const HOT_MONTHS = [4, 5, 6, 7, 8]; // May–Sep (0-indexed)

export function getFallbackHeatStatus(): HeatStatus {
  const month = new Date().getMonth();
  return HOT_MONTHS.includes(month) ? 'danger' : 'caution';
}

export function tempToHeatStatus(tempCelsius: number): HeatStatus {
  if (tempCelsius >= 45) return 'extreme';
  if (tempCelsius >= 40) return 'danger';
  if (tempCelsius >= 35) return 'caution';
  return 'normal';
}

export async function fetchMakkahWeather(apiKey: string): Promise<{
  tempCelsius: number;
  heatIndex: number;
  success: boolean;
}> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Makkah,SA&units=metric&appid=${apiKey}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (!response.ok) {
      return { tempCelsius: 0, heatIndex: 0, success: false };
    }

    const data = await response.json() as {
      main: { temp: number; feels_like: number };
    };
    return {
      tempCelsius: data.main.temp,
      heatIndex: data.main.feels_like,
      success: true,
    };
  } catch {
    return { tempCelsius: 0, heatIndex: 0, success: false };
  }
}

export function shouldSuppressHeatAlert(params: {
  isRitualActive: boolean;
  suppressAllOverlays: boolean;
  lastHydrationPrompt: Date | null;
}): boolean {
  if (params.isRitualActive) return true;
  if (params.suppressAllOverlays) return true;
  if (params.lastHydrationPrompt) {
    const minutesSince =
      (Date.now() - params.lastHydrationPrompt.getTime()) / 60000;
    if (minutesSince < 20) return true;
  }
  return false;
}

export function findNearestClinic(
  userCoords: Coordinates,
  zone: string | null
): Coordinates | null {
  const zoneClinic = zone
    ? HEALTH_CLINICS.find((c) => c.zone === zone)
    : null;

  if (zoneClinic) return zoneClinic.coordinates;

  let nearest = null;
  let nearestDist = Infinity;
  for (const clinic of HEALTH_CLINICS) {
    const dist = haversineMeters(userCoords, clinic.coordinates);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = clinic.coordinates;
    }
  }
  return nearest;
}
