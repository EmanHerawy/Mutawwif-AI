import type { GPSReadingModel, Coordinates } from '../types/location.types';

const BUFFER_SIZE = 5;
const OUTLIER_DISTANCE_METERS = 50;
const OUTLIER_TIME_WINDOW_MS = 3000;

// GPS Confidence mapping — cross-platform (iOS + Android both report meters)
export function mapAccuracyToConfidence(accuracyMeters: number): number {
  if (accuracyMeters <= 5) return 1.0;
  if (accuracyMeters <= 10) return 0.85;
  if (accuracyMeters <= 15) return 0.7;
  if (accuracyMeters <= 20) return 0.55;
  if (accuracyMeters <= 30) return 0.4;
  if (accuracyMeters <= 50) return 0.2;
  return 0.0;
}

export function haversineMeters(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const ha =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(ha), Math.sqrt(1 - ha));
}

export function haversineKm(a: Coordinates, b: Coordinates): number {
  return haversineMeters(a, b) / 1000;
}

function bufferMean(buffer: Coordinates[]): Coordinates {
  const sum = buffer.reduce(
    (acc, c) => ({ latitude: acc.latitude + c.latitude, longitude: acc.longitude + c.longitude }),
    { latitude: 0, longitude: 0 }
  );
  return {
    latitude: sum.latitude / buffer.length,
    longitude: sum.longitude / buffer.length,
  };
}

class GPSFilterService {
  private buffer: Coordinates[] = [];
  private lastTimestamp: number = 0;
  private lowConfidenceStart: number | null = null;

  process(raw: Coordinates, accuracyMeters: number, timestamp: number): GPSReadingModel {
    const confidence = mapAccuracyToConfidence(accuracyMeters);
    let isOutlier = false;
    let filtered: Coordinates;

    if (this.buffer.length >= 1) {
      const mean = bufferMean(this.buffer);
      const distance = haversineMeters(raw, mean);
      const timeDelta = timestamp - this.lastTimestamp;

      if (distance > OUTLIER_DISTANCE_METERS && timeDelta < OUTLIER_TIME_WINDOW_MS) {
        isOutlier = true;
      }
    }

    if (!isOutlier) {
      this.buffer.push(raw);
      if (this.buffer.length > BUFFER_SIZE) {
        this.buffer.shift();
      }
    }

    filtered = this.buffer.length > 0 ? bufferMean(this.buffer) : raw;
    this.lastTimestamp = timestamp;

    // Track low confidence duration
    if (confidence < 0.3) {
      if (this.lowConfidenceStart === null) {
        this.lowConfidenceStart = timestamp;
      }
    } else {
      this.lowConfidenceStart = null;
    }

    return {
      raw,
      filtered,
      confidence,
      isOutlier,
      timestamp: new Date(timestamp),
      accuracyMeters,
    };
  }

  isLowConfidenceFor30Seconds(currentTimestamp: number): boolean {
    if (this.lowConfidenceStart === null) return false;
    return currentTimestamp - this.lowConfidenceStart >= 30000;
  }

  reset() {
    this.buffer = [];
    this.lastTimestamp = 0;
    this.lowConfidenceStart = null;
  }
}

export const gpsFilterService = new GPSFilterService();
