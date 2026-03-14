import { Linking, Platform } from 'react-native';

/**
 * Opens the given coordinates in Google Maps (or Apple Maps on iOS as fallback).
 * Uses a universal web URL that works on web, iOS, and Android.
 *
 * @param lat  - Latitude  (VERIFY_COORDINATES before production)
 * @param lng  - Longitude (VERIFY_COORDINATES before production)
 * @param label - Optional location label shown in the map app
 */
export async function openInMaps(lat: number, lng: number, label?: string): Promise<void> {
  const encoded = label ? encodeURIComponent(label) : '';

  // On iOS, prefer Apple Maps when no Google Maps app is installed
  if (Platform.OS === 'ios') {
    const appleMapsUrl = `maps://maps.apple.com/?q=${encoded}&ll=${lat},${lng}`;
    const canApple = await Linking.canOpenURL(appleMapsUrl);
    if (canApple) {
      await Linking.openURL(appleMapsUrl);
      return;
    }
  }

  // Universal fallback: Google Maps web URL (works on web + Android + iOS browser)
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  await Linking.openURL(googleUrl);
}
