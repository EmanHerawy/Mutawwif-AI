import { Magnetometer } from 'expo-sensors';
import type { Subscription } from 'expo-sensors';

type CompassListener = (bearing: number) => void;

class CompassService {
  private subscription: Subscription | null = null;
  private listeners: Set<CompassListener> = new Set();
  private lastBearing = 0;

  start() {
    if (this.subscription) return;
    Magnetometer.setUpdateInterval(200);
    this.subscription = Magnetometer.addListener(({ x, y }) => {
      // Convert magnetometer data to compass bearing
      let bearing = Math.atan2(y, x) * (180 / Math.PI);
      bearing = (bearing + 360) % 360;
      this.lastBearing = bearing;
      for (const listener of this.listeners) {
        listener(bearing);
      }
    });
  }

  stop() {
    this.subscription?.remove();
    this.subscription = null;
  }

  addListener(listener: CompassListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getBearing(): number {
    return this.lastBearing;
  }
}

export const compassService = new CompassService();
