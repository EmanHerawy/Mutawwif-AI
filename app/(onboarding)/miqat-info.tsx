import { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import { MIQAT_ZONES } from '../../src/data/miqat-zones';
import ScreenBackground from '../../src/components/ScreenBackground';

// Haversine distance in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectMiqatFromCoords(lat: number, lon: number): string {
  let nearest = MIQAT_ZONES[0];
  let minDist = Infinity;
  for (const zone of MIQAT_ZONES) {
    const d = haversineKm(lat, lon, zone.coordinates.latitude, zone.coordinates.longitude);
    if (d < minDist) { minDist = d; nearest = zone; }
  }
  return nearest.id;
}

// Curated city autocomplete list derived from REGION_MIQAT keywords
const CITY_SUGGESTIONS: { label: string; miqatId: string }[] = [
  // Al-Juhfah (Rabigh) — Egypt, Levant, North Africa, Europe, Americas
  { label: 'Cairo, Egypt', miqatId: 'al_juhfah' },
  { label: 'Alexandria, Egypt', miqatId: 'al_juhfah' },
  { label: 'Amman, Jordan', miqatId: 'al_juhfah' },
  { label: 'Casablanca, Morocco', miqatId: 'al_juhfah' },
  { label: 'Tunis, Tunisia', miqatId: 'al_juhfah' },
  { label: 'Algiers, Algeria', miqatId: 'al_juhfah' },
  { label: 'Tripoli, Libya', miqatId: 'al_juhfah' },
  { label: 'London, UK', miqatId: 'al_juhfah' },
  { label: 'Paris, France', miqatId: 'al_juhfah' },
  { label: 'New York, USA', miqatId: 'al_juhfah' },
  { label: 'Toronto, Canada', miqatId: 'al_juhfah' },
  // Dhul Hulayfah — Medina
  { label: 'Madinah, Saudi Arabia', miqatId: 'dhul_hulayfah' },
  // Dhat Irq — Iraq, Iran, Kuwait, Syria
  { label: 'Baghdad, Iraq', miqatId: 'dhat_irq' },
  { label: 'Tehran, Iran', miqatId: 'dhat_irq' },
  { label: 'Kuwait City, Kuwait', miqatId: 'dhat_irq' },
  { label: 'Damascus, Syria', miqatId: 'dhat_irq' },
  // Qarn Al-Manazil — Pakistan, India, Malaysia, Indonesia, Riyadh, Taif
  { label: 'Karachi, Pakistan', miqatId: 'qarn_al_manazil' },
  { label: 'Lahore, Pakistan', miqatId: 'qarn_al_manazil' },
  { label: 'Islamabad, Pakistan', miqatId: 'qarn_al_manazil' },
  { label: 'Mumbai, India', miqatId: 'qarn_al_manazil' },
  { label: 'Delhi, India', miqatId: 'qarn_al_manazil' },
  { label: 'Hyderabad, India', miqatId: 'qarn_al_manazil' },
  { label: 'Kuala Lumpur, Malaysia', miqatId: 'qarn_al_manazil' },
  { label: 'Jakarta, Indonesia', miqatId: 'qarn_al_manazil' },
  { label: 'Riyadh, Saudi Arabia', miqatId: 'qarn_al_manazil' },
  { label: 'Taif, Saudi Arabia', miqatId: 'qarn_al_manazil' },
  // Yalamlam — Yemen, Oman, East Africa
  { label: "Sana'a, Yemen", miqatId: 'yalamlam' },
  { label: 'Muscat, Oman', miqatId: 'yalamlam' },
  { label: 'Addis Ababa, Ethiopia', miqatId: 'yalamlam' },
  { label: 'Khartoum, Sudan', miqatId: 'yalamlam' },
  { label: 'Mogadishu, Somalia', miqatId: 'yalamlam' },
  // Arabic names
  { label: 'القاهرة، مصر', miqatId: 'al_juhfah' },
  { label: 'المدينة المنورة', miqatId: 'dhul_hulayfah' },
  { label: 'بغداد، العراق', miqatId: 'dhat_irq' },
  { label: 'الكويت', miqatId: 'dhat_irq' },
  { label: 'كراتشي، باكستان', miqatId: 'qarn_al_manazil' },
  { label: 'الرياض، السعودية', miqatId: 'qarn_al_manazil' },
  { label: 'صنعاء، اليمن', miqatId: 'yalamlam' },
  { label: 'مسقط، عمان', miqatId: 'yalamlam' },
];

function filterCities(query: string): { label: string; miqatId: string }[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return CITY_SUGGESTIONS.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 8);
}

export default function MiqatInfoScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { persona, completeOnboarding } = usePersonaStore();

  const isAr = i18n.language.startsWith('ar');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOverride, setShowOverride] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // City search state
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<{ label: string; miqatId: string }[]>([]);

  const selectedZone = selectedId ? MIQAT_ZONES.find((z) => z.id === selectedId) : null;
  const zoneName = (zone: typeof MIQAT_ZONES[0]) => isAr ? zone.nameAr : zone.nameEn;

  const handleCityInput = useCallback((text: string) => {
    setCityQuery(text);
    setCitySuggestions(filterCities(text));
  }, []);

  const handleCitySelect = (city: { label: string; miqatId: string }) => {
    setCityQuery(city.label);
    setCitySuggestions([]);
    setSelectedId(city.miqatId);
    setShowOverride(false);
  };

  const requestLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationGranted(true);
          const detected = detectMiqatFromCoords(pos.coords.latitude, pos.coords.longitude);
          setSelectedId(detected);
          setShowOverride(false);
        },
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
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.step}>4 / 4</Text>
          <Text style={styles.title}>{t('onboarding.miqat_title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.miqat_subtitle')}</Text>
        </View>

        {/* City search to update Miqat */}
        <View style={styles.citySearchCard}>
          <Text style={styles.citySearchLabel}>{t('onboarding.origin_city_label')}</Text>
          <TextInput
            style={styles.cityInput}
            value={cityQuery}
            onChangeText={handleCityInput}
            placeholder={t('onboarding.origin_city_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
            autoCapitalize="words"
            returnKeyType="search"
          />
          {citySuggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              {citySuggestions.map((city) => (
                <TouchableOpacity
                  key={city.label}
                  style={styles.suggestionRow}
                  onPress={() => handleCitySelect(city)}
                >
                  <Text style={styles.suggestionText}>{city.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Confirmed selection card */}
        {selectedZone && !showOverride ? (
          <View style={styles.confirmedCard}>
            <View style={styles.confirmedLeft}>
              <Text style={styles.confirmedBadge}>
                {locationGranted
                  ? '📍 ' + t('onboarding.miqat_location_granted')
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 20 },
  step: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textPrimary, opacity: 0.6, lineHeight: 20 },
  // City search
  citySearchCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  citySearchLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, opacity: 0.7, marginBottom: 8 },
  cityInput: {
    backgroundColor: Colors.parchmentBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.brandGreen + '33',
  },
  suggestionsBox: {
    marginTop: 4, borderRadius: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: Colors.brandGreen + '33',
  },
  suggestionRow: {
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '18',
  },
  suggestionText: { fontSize: 14, color: Colors.textPrimary },
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
  deniedCard: {
    backgroundColor: Colors.warning + '18', borderRadius: 12, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.warning + '44',
  },
  deniedText: { fontSize: 13, color: Colors.textPrimary, opacity: 0.75, lineHeight: 20 },
  finishBtn: { backgroundColor: Colors.goldAccent, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  finishText: { color: Colors.brandGreen, fontSize: 17, fontWeight: '800' },
});
