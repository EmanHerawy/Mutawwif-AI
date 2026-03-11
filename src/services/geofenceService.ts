import { HARAM_ZONES } from '../data/haram-zones';
import { haversineMeters } from './gpsFilterService';
import type { Coordinates, HaramZone } from '../types/location.types';

const REQUIRED_CONSECUTIVE_READINGS = 3;

interface ZoneCounter {
  zone: HaramZone;
  consecutiveHits: number;
  consecutiveMisses: number;
}

class GeofenceService {
  private counters: Map<string, ZoneCounter> = new Map();
  private currentZone: HaramZone = null;

  evaluate(filtered: Coordinates): HaramZone {
    // Find which zone(s) the user is in
    const matchedZones: HaramZone[] = [];

    for (const zone of HARAM_ZONES) {
      if (zone.id === null) continue;
      const dist = haversineMeters(filtered, zone.center);
      if (dist <= zone.radiusMeters) {
        matchedZones.push(zone.id);
      }
    }

    // Update counters for all zones
    for (const zone of HARAM_ZONES) {
      if (zone.id === null) continue;
      const key = zone.id as string;
      const existing = this.counters.get(key) ?? {
        zone: zone.id,
        consecutiveHits: 0,
        consecutiveMisses: 0,
      };

      if (matchedZones.includes(zone.id)) {
        existing.consecutiveHits += 1;
        existing.consecutiveMisses = 0;
      } else {
        existing.consecutiveMisses += 1;
        existing.consecutiveHits = 0;
      }

      this.counters.set(key, existing);
    }

    // Determine current zone by priority (smaller radius = more specific)
    const sortedZones = [...HARAM_ZONES].sort(
      (a, b) => a.radiusMeters - b.radiusMeters
    );

    for (const zone of sortedZones) {
      if (zone.id === null) continue;
      const counter = this.counters.get(zone.id as string);
      if (counter && counter.consecutiveHits >= REQUIRED_CONSECUTIVE_READINGS) {
        this.currentZone = zone.id;
        return this.currentZone;
      }
    }

    // Check if we have 3 consecutive misses for current zone
    if (this.currentZone !== null) {
      const counter = this.counters.get(this.currentZone as string);
      if (counter && counter.consecutiveMisses >= REQUIRED_CONSECUTIVE_READINGS) {
        this.currentZone = null;
      }
    }

    return this.currentZone;
  }

  reset() {
    this.counters.clear();
    this.currentZone = null;
  }
}

export const geofenceService = new GeofenceService();
