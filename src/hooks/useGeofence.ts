import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';
import { gpsFilterService } from '../services/gpsFilterService';
import { geofenceService } from '../services/geofenceService';
import { miqatService } from '../services/miqatService';

export function useGeofence() {
  const updateGPS = useLocationStore((s) => s.updateGPS);
  const setCurrentZone = useLocationStore((s) => s.setCurrentZone);
  const setMiqatStatus = useLocationStore((s) => s.setMiqatStatus);
  const setMiqatAssignment = useLocationStore((s) => s.setMiqatAssignment);
  const setAlreadyCrossed = useLocationStore((s) => s.setAlreadyCrossed);
  const setManualMode = useLocationStore((s) => s.setManualMode);

  const currentZone = useLocationStore((s) => s.currentZone);
  const isManualMode = useLocationStore((s) => s.isManualMode);
  const showLandmarkGuide = useLocationStore((s) => s.showLandmarkGuide);
  const miqatStatus = useLocationStore((s) => s.miqatStatus);
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);

  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setManualMode(true);
        return;
      }

      watcherRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 2,
        },
        (location) => {
          if (!mounted) return;

          const raw = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          const accuracy = location.coords.accuracy ?? 50;

          const reading = gpsFilterService.process(raw, accuracy, location.timestamp);
          updateGPS(reading);

          // Update zone via geofenceService
          const zone = geofenceService.evaluate(reading.filtered);
          setCurrentZone(zone);

          // Update Miqat status via miqatService (bearing-validated)
          const miqatResult = miqatService.evaluate(reading.filtered);
          if (miqatResult.assignedMiqat) {
            setMiqatAssignment(miqatResult.assignedMiqat);
          }
          setMiqatStatus(miqatResult.status);

          if (miqatResult.isJeddahAirport) {
            setAlreadyCrossed(true);
          }
        }
      );
    })();

    return () => {
      mounted = false;
      watcherRef.current?.remove();
    };
  }, [updateGPS, setCurrentZone, setMiqatStatus, setMiqatAssignment, setAlreadyCrossed, setManualMode]);

  return {
    currentZone,
    isManualMode,
    showLandmarkGuide,
    miqatStatus,
    miqatAssignment,
  };
}
