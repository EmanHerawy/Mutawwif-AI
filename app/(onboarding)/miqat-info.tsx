import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import { MIQAT_ZONES } from '../../src/data/miqat-zones';
import { detectMiqatFromCity } from './origin';

export default function MiqatInfoScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, completeOnboarding } = usePersonaStore();

  const isAr = (persona?.languageCode ?? 'en').startsWith('ar');

  // Derive suggestion from city entered on screen 3
  const suggestedId = persona?.originConfirmed
    ? detectMiqatFromCity(persona.originConfirmed)
    : null;

  const [selectedId, setSelectedId] = useState<string | null>(suggestedId);
  const [showOverride, setShowOverride] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const selectedZone = selectedId ? MIQAT_ZONES.find((z) => z.id === selectedId) : null;
  const zoneName = (zone: typeof MIQAT_ZONES[0]) => isAr ? zone.nameAr : zone.nameEn;

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
          <Text style={styles.subtitle}>{t('onboarding.miqat_subtitle')}</Text>
        </View>

        {/* Confirmed selection card */}
        {selectedZone && !showOverride ? (
          <View style={styles.confirmedCard}>
            <View style={styles.confirmedLeft}>
              <Text style={styles.confirmedBadge}>
                {suggestedId === selectedId
                  ? t('onboarding.miqat_suggested')
                  : t('onboarding.miqat_confirmed')}
              </Text>
              <Text style={styles.confirmedName}>{zoneName(selectedZone)}</Text>
              <Text style={styles.confirmedSub}>{isAr ? selectedZone.nameEn : selectedZone.nameAr}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowOverride(true)} style={styles.changeBtn}>
              <Text style={styles.changeBtnText}>{t('onboarding.miqat_change')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* No suggestion or user wants to override — show selection list */
          <View style={styles.selectCard}>
            <Text style={styles.selectTitle}>{t('onboarding.miqat_select_manually')}</Text>
            {MIQAT_ZONES.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                style={[styles.zoneRow, selectedId === zone.id && styles.zoneRowActive]}
                onPress={() => { setSelectedId(zone.id); setShowOverride(false); }}
              >
                <View style={[styles.radio, selectedId === zone.id && styles.radioActive]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.zoneName, selectedId === zone.id && styles.zoneNameActive]}>
                    {zoneName(zone)}
                  </Text>
                  <Text style={styles.zoneSub}>{isAr ? zone.nameEn : zone.nameAr}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Explanation */}
        <View style={styles.explainCard}>
          <Text style={styles.explainTitle}>{t('onboarding.miqat_what_is')}</Text>
          <Text style={styles.explainBody}>{t('onboarding.miqat_explanation')}</Text>
        </View>

        {/* Location permission */}
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
  header: { marginBottom: 24 },
  step: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textPrimary, opacity: 0.6, lineHeight: 20 },
  // Confirmed card
  confirmedCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.brandGreen,
    borderRadius: 16, padding: 18, marginBottom: 20, gap: 12,
  },
  confirmedLeft: { flex: 1 },
  confirmedBadge: { fontSize: 11, color: Colors.goldAccent, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  confirmedName: { fontSize: 20, fontWeight: '700', color: Colors.white, marginBottom: 2 },
  confirmedSub: { fontSize: 12, color: Colors.white, opacity: 0.6 },
  changeBtn: { backgroundColor: Colors.white + '22', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  changeBtnText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  // Manual select card
  selectCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginBottom: 20, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  selectTitle: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen, opacity: 0.7, marginBottom: 12 },
  zoneRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    borderRadius: 10, marginBottom: 4,
  },
  zoneRowActive: { backgroundColor: Colors.brandGreen + '0D' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.brandGreen + '55' },
  radioActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  zoneName: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  zoneNameActive: { color: Colors.brandGreen, fontWeight: '700' },
  zoneSub: { fontSize: 11, color: Colors.textPrimary, opacity: 0.45 },
  // Explanation
  explainCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  explainTitle: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 8 },
  explainBody: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, opacity: 0.75 },
  // Location permission
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
