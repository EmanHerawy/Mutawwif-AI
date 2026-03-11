import { MIQAT_ZONES, KAABA_COORDS, JEDDAH_AIRPORT } from '../data/miqat-zones';
import { haversineKm, haversineMeters } from './gpsFilterService';
import type { Coordinates, MiqatName, MiqatStatus } from '../types/location.types';

const ALERT_DISTANCES_KM = [50, 10, 2];

// Compute compass bearing from point A to point B (degrees, 0–360)
function bearingDegrees(from: Coordinates, to: Coordinates): number {
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const dLng = ((to.longitude - from.longitude) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function angleDifference(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

interface MiqatEvalResult {
  assignedMiqat: MiqatName | null;
  status: MiqatStatus;
  isJeddahAirport: boolean;
  shouldAlert50km: boolean;
  shouldAlert10km: boolean;
  shouldAlertArrival: boolean;
  bearingValid: boolean;
  approachingMakkah: boolean;
}

class MiqatService {
  private previousDistanceToMakkah: number | null = null;

  evaluate(coords: Coordinates): MiqatEvalResult {
    // Check Jeddah airport special case
    const isJeddahAirport =
      haversineKm(coords, JEDDAH_AIRPORT.center) <= JEDDAH_AIRPORT.radiusKm;

    const bearingToMakkah = bearingDegrees(coords, KAABA_COORDS);
    const distanceToMakkah = haversineKm(coords, KAABA_COORDS);

    // Bearing validation: Miqat must be between user and Makkah
    let closestMiqat: typeof MIQAT_ZONES[0] | null = null;
    let closestDistance = Infinity;

    for (const zone of MIQAT_ZONES) {
      const dist = haversineKm(coords, zone.coordinates);
      if (dist < closestDistance) {
        closestDistance = dist;
        closestMiqat = zone;
      }
    }

    let bearingValid = false;
    let approachingMakkah = false;

    if (closestMiqat) {
      const bearingToMiqat = bearingDegrees(coords, closestMiqat.coordinates);
      const angleDiff = angleDifference(bearingToMakkah, bearingToMiqat);
      bearingValid = angleDiff <= 30;

      if (this.previousDistanceToMakkah !== null) {
        approachingMakkah =
          distanceToMakkah < this.previousDistanceToMakkah + 0.5; // within 500m tolerance
      }
    }

    this.previousDistanceToMakkah = distanceToMakkah;

    // Only fire alerts when all three conditions met
    const canAlert = bearingValid && approachingMakkah && !isJeddahAirport;

    let status: MiqatStatus = 'not_assigned';
    const assignedMiqat = closestMiqat?.id ?? null;

    if (closestMiqat) {
      status = 'assigned';
      if (canAlert) {
        if (closestDistance <= 2) status = 'at_miqat';
        else if (closestDistance <= 10) status = 'approaching_10km';
        else if (closestDistance <= 50) status = 'approaching_50km';
      }
    }

    return {
      assignedMiqat,
      status,
      isJeddahAirport,
      shouldAlert50km: canAlert && closestDistance <= 50 && closestDistance > 10,
      shouldAlert10km: canAlert && closestDistance <= 10 && closestDistance > 2,
      shouldAlertArrival: canAlert && closestDistance <= 2,
      bearingValid,
      approachingMakkah,
    };
  }

  reset() {
    this.previousDistanceToMakkah = null;
  }
}

export const miqatService = new MiqatService();
