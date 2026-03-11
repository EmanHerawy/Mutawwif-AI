import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../stores/personaStore';
import { useLocationStore } from '../stores/locationStore';
import { useIdentityStore } from '../stores/identityStore';
import { sendSOS } from '../services/smsService';
import { Colors } from '../theme/colors';
import { TouchTarget } from '../theme/spacing';

export function SosButton() {
  const { t } = useTranslation();
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);

  const persona = usePersonaStore((s) => s.persona);
  const filteredCoords = useLocationStore((s) => s.filteredCoords);
  const nusukIdNumber = useIdentityStore((s) => s.nusukIdNumber);

  const handlePress = useCallback(() => {
    if (!persona) return;

    Alert.alert(
      t('tracker.sos_confirm_title'),
      t('tracker.sos_confirm_message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.send'),
          style: 'destructive',
          onPress: async () => {
            await sendSOS({
              persona,
              coords: filteredCoords,
              identity: { nusukIdNumber },
              timestamp: new Date(),
            });
            setLastSentAt(new Date());
          },
        },
      ]
    );
  }, [persona, filteredCoords, nusukIdNumber, t]);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${t('tracker.sos_label_ar')} ${t('tracker.sos_button')}`}
      >
        <Text style={styles.arabicLabel}>{t('tracker.sos_label_ar')}</Text>
        <Text style={styles.label}>{t('tracker.sos_button')}</Text>
      </TouchableOpacity>
      {lastSentAt && (
        <Text style={styles.sentAt}>
          {t('tracker.sos_sent')} {lastSentAt.toLocaleTimeString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  button: {
    width: TouchTarget.sos,
    height: TouchTarget.sos,
    borderRadius: TouchTarget.sos / 2,
    backgroundColor: Colors.alertWarning,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  arabicLabel: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  label: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  sentAt: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
});
