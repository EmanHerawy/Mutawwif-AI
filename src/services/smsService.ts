import * as SMS from 'expo-sms';
import * as Clipboard from 'expo-clipboard';
import type { PersonaModel } from '../types/persona.types';
import type { Coordinates } from '../types/location.types';
import type { IdentityModel } from '../types/identity.types';

export interface SOSPayload {
  persona: PersonaModel;
  coords: Coordinates | null;
  identity: Pick<IdentityModel, 'nusukIdNumber'>;
  timestamp: Date;
}

export function buildSOSMessage(payload: SOSPayload): string {
  const { persona, coords, identity, timestamp } = payload;
  const coordStr = coords
    ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
    : 'GPS unavailable';
  const timeStr = timestamp.toLocaleString('en-SA', { timeZone: 'Asia/Riyadh' });

  return [
    '[Al-Mutawwif SOS] I am lost.',
    `Name: ${persona.name}`,
    identity.nusukIdNumber ? `Nusuk ID: ${identity.nusukIdNumber}` : '',
    `Hotel: ${persona.hotelName || 'Not set'}`,
    `Last GPS: ${coordStr}`,
    `Time: ${timeStr}`,
    'Please call me or contact hotel.',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendSOS(payload: SOSPayload): Promise<{ sent: boolean; method: 'sms' | 'clipboard' }> {
  const message = buildSOSMessage(payload);

  // Also copy coords to clipboard as fallback
  if (payload.coords) {
    await Clipboard.setStringAsync(
      `${payload.coords.latitude.toFixed(6)}, ${payload.coords.longitude.toFixed(6)}`
    );
  }

  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable && payload.persona.emergencyContactPhone) {
    await SMS.sendSMSAsync([payload.persona.emergencyContactPhone], message);
    return { sent: true, method: 'sms' };
  }

  // SMS not available — message is in clipboard
  await Clipboard.setStringAsync(message);
  return { sent: false, method: 'clipboard' };
}
