import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { Colors } from '../../src/theme/colors';
import { MIQAT_ZONES } from '../../src/data/miqat-zones';

export default function MiqatInfoScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, completeOnboarding } = usePersonaStore();
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);
  const [locationGranted, setLocationGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const assignedZone = miqatAssignment
    ? MIQAT_ZONES.find((z) => z.id === miqatAssignment)
    : null;
  const isAr = (persona?.languageCode ?? 'en').startsWith('ar');

  const requestLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationGranted(true),
        () => setPermissionDenied(true)
      );
    } else {
      setLocationGranted(true);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.step}>5 / 5</Text>
          <Text style={styles.title}>{t('onboarding.miqat_title')}</Text>
        </View>

        {assignedZone ? (
          <View style={styles.miqatCard}>
            <Text style={styles.miqatEmoji}>🕌</Text>
            <Text style={styles.miqatLabel}>{t('miqat.assigned', { name: '' })}</Text>
            <Text style={styles.miqatName}>{isAr ? assignedZone.nameAr : assignedZone.nameEn}</Text>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{t('onboarding.origin_miqat_autodetect')}</Text>
          </View>
        )}

        <View style={styles.explainCard}>
          <Text style={styles.explainTitle}>{t('onboarding.miqat_what_is')}</Text>
          <Text style={styles.explainBody}>{t('onboarding.miqat_explanation')}</Text>
        </View>

        {!locationGranted && !permissionDenied && (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>📍 {t('onboarding.miqat_location_permission')}</Text>
            <Text style={styles.permissionBody}>{t('onboarding.miqat_permission_reason')}</Text>
            <TouchableOpacity style={styles.permissionBtn} onPress={requestLocation}>
              <Text style={styles.permissionBtnText}>{t('onboarding.miqat_location_permission')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {locationGranted && (
          <View style={styles.grantedCard}>
            <Text style={styles.grantedText}>✅ {t('onboarding.miqat_location_granted')}</Text>
          </View>
        )}

        {permissionDenied && (
          <View style={styles.deniedCard}>
            <Text style={styles.deniedText}>{t('onboarding.miqat_location_denied')}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishText}>{t('onboarding.miqat_start_journey')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 28 },
  step: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen },
  miqatCard: {
    backgroundColor: Colors.brandGreen, borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 20,
  },
  miqatEmoji: { fontSize: 40, marginBottom: 8 },
  miqatLabel: { fontSize: 13, color: Colors.white, opacity: 0.7, marginBottom: 4 },
  miqatName: { fontSize: 22, fontWeight: '700', color: Colors.goldAccent, textAlign: 'center' },
  infoCard: {
    backgroundColor: Colors.goldAccent + '18', borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.goldAccent + '44',
  },
  infoText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  explainCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  explainTitle: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 8 },
  explainBody: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, opacity: 0.75 },
  permissionCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1.5, borderColor: Colors.brandGreen + '44',
  },
  permissionTitle: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  permissionBody: { fontSize: 13, color: Colors.textPrimary, opacity: 0.7, lineHeight: 20, marginBottom: 14 },
  permissionBtn: { backgroundColor: Colors.brandGreen, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  permissionBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  grantedCard: {
    backgroundColor: Colors.success + '18', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.success + '44',
  },
  grantedText: { fontSize: 14, color: Colors.success, fontWeight: '600' },
  deniedCard: {
    backgroundColor: Colors.warning + '18', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.warning + '44',
  },
  deniedText: { fontSize: 13, color: Colors.textPrimary, opacity: 0.75, lineHeight: 20 },
  finishBtn: { backgroundColor: Colors.goldAccent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  finishText: { color: Colors.brandGreen, fontSize: 17, fontWeight: '800' },
});
