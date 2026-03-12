import * as Location from 'expo-location';
import { gpsFilterService } from './gpsFilterService';
import { geofenceService } from './geofenceService';
import { useLocationStore } from '../stores/locationStore';

class GPSService {
  private subscription: Location.LocationSubscription | null = null;

  async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async start(): Promise<boolean> {
    if (this.subscription) return true; // already running

    const granted = await this.requestPermission();
    if (!granted) return false;

    this.subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,     // update every 5 m of movement
        timeInterval: 3000,      // or every 3 s
      },
      (location) => {
        const raw = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const reading = gpsFilterService.process(
          raw,
          location.coords.accuracy ?? 20,
          location.timestamp,
        );
        useLocationStore.getState().updateGPS(reading);

        const zone = geofenceService.evaluate(reading.filtered);
        useLocationStore.getState().setCurrentZone(zone);
      },
    );

    return true;
  }

  stop() {
    this.subscription?.remove();
    this.subscription = null;
    gpsFilterService.reset();
    geofenceService.reset();
  }

  get isRunning(): boolean {
    return this.subscription !== null;
  }
}

export const gpsService = new GPSService();
