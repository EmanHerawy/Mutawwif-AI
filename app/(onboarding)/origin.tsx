import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import { MIQAT_ZONES } from '../../src/data/miqat-zones';

const REGION_MIQAT: { keywords: string[]; miqatId: string }[] = [
  { keywords: ['egypt', 'cairo', 'alex', 'مصر', 'القاهرة', 'jordan', 'morocco', 'tunisia', 'algeria', 'libya', 'europe', 'usa', 'canada', 'uk', 'london', 'paris'], miqatId: 'al_juhfah' },
  { keywords: ['medina', 'madinah', 'المدينة', 'saudi', 'السعودية'], miqatId: 'dhul_hulayfah' },
  { keywords: ['iraq', 'iran', 'العراق', 'إيران', 'kuwait', 'الكويت', 'syria', 'سوريا'], miqatId: 'dhat_irq' },
  { keywords: ['najd', 'riyadh', 'الرياض', 'نجد', 'taif', 'الطائف', 'pakistan', 'india', 'باكستان', 'الهند', 'malaysia', 'ماليزيا', 'indonesia', 'إندونيسيا'], miqatId: 'qarn_al_manazil' },
  { keywords: ['yemen', 'اليمن', 'oman', 'عمان', 'ethiopia', 'إثيوبيا', 'sudan', 'السودان', 'somalia', 'الصومال'], miqatId: 'yalamlam' },
];

function detectMiqat(city: string): string | null {
  const lower = city.toLowerCase();
  for (const region of REGION_MIQAT) {
    if (region.keywords.some((k) => lower.includes(k.toLowerCase()))) return region.miqatId;
  }
  return null;
}

export default function OriginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, updatePersona } = usePersonaStore();

  const [city, setCity] = useState(persona?.originConfirmed ?? '');
  const [detectedMiqat, setDetectedMiqat] = useState<string | null>(null);
  const [error, setError] = useState('');

  const isAr = (persona?.languageCode ?? 'en').startsWith('ar');

  const handleCityChange = (val: string) => {
    setCity(val);
    setError('');
    setDetectedMiqat(val.length >= 2 ? detectMiqat(val) : null);
  };

  const getMiqatName = (id: string) => {
    const zone = MIQAT_ZONES.find((z) => z.id === id);
    return zone ? (isAr ? zone.nameAr : zone.nameEn) : id;
  };

  const handleNext = () => {
    if (!city.trim()) { setError(t('onboarding.origin_city_required')); return; }
    updatePersona({ originConfirmed: city.trim() });
    router.push('/(onboarding)/identity');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.step}>3 / 5</Text>
            <Text style={styles.title}>{t('onboarding.origin_title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.origin_subtitle')}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t('onboarding.origin_city_label')}</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={city}
              onChangeText={handleCityChange}
              placeholder={t('onboarding.origin_city_placeholder')}
              placeholderTextColor={Colors.textPrimary + '55'}
              autoCapitalize="words"
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {detectedMiqat ? (
            <View style={styles.miqatCard}>
              <Text style={styles.miqatIcon}>🕌</Text>
              <View style={styles.miqatInfo}>
                <Text style={styles.miqatLabel}>{t('onboarding.origin_miqat_label')}</Text>
                <Text style={styles.miqatName}>{getMiqatName(detectedMiqat)}</Text>
              </View>
            </View>
          ) : city.length >= 2 ? (
            <View style={styles.miqatCardUnknown}>
              <Text style={styles.miqatUnknownText}>{t('onboarding.origin_miqat_autodetect')}</Text>
            </View>
          ) : null}

          <View style={styles.allMiqats}>
            <Text style={styles.allMiqatsTitle}>{t('onboarding.origin_miqat_boundaries')}</Text>
            {MIQAT_ZONES.map((zone) => (
              <View key={zone.id} style={[styles.miqatRow, detectedMiqat === zone.id && styles.miqatRowActive]}>
                <View style={[styles.miqatDot, detectedMiqat === zone.id && styles.miqatDotActive]} />
                <View>
                  <Text style={[styles.miqatRowName, detectedMiqat === zone.id && styles.miqatRowNameActive]}>
                    {isAr ? zone.nameAr : zone.nameEn}
                  </Text>
                  <Text style={styles.miqatRowSub}>{isAr ? zone.nameEn : zone.nameAr}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>{t('common.next')} →</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 32 },
  step: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textPrimary, opacity: 0.6 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, opacity: 0.7 },
  input: {
    backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  miqatCard: {
    flexDirection: 'row', backgroundColor: Colors.brandGreen + '0F', borderRadius: 14,
    padding: 16, marginBottom: 20, gap: 12, borderWidth: 1.5, borderColor: Colors.brandGreen + '44', alignItems: 'center',
  },
  miqatIcon: { fontSize: 32 },
  miqatInfo: { flex: 1 },
  miqatLabel: { fontSize: 12, color: Colors.brandGreen, fontWeight: '600', opacity: 0.7, marginBottom: 2 },
  miqatName: { fontSize: 17, fontWeight: '700', color: Colors.brandGreen },
  miqatCardUnknown: {
    backgroundColor: Colors.goldAccent + '15', borderRadius: 14, padding: 14,
    marginBottom: 20, borderWidth: 1, borderColor: Colors.goldAccent + '44',
  },
  miqatUnknownText: { fontSize: 13, color: Colors.textPrimary, opacity: 0.7 },
  allMiqats: { marginBottom: 24 },
  allMiqatsTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, opacity: 0.5, marginBottom: 12 },
  miqatRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4,
  },
  miqatRowActive: { backgroundColor: Colors.brandGreen + '0D' },
  miqatDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brandGreen + '44' },
  miqatDotActive: { backgroundColor: Colors.brandGreen, width: 10, height: 10, borderRadius: 5 },
  miqatRowName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  miqatRowNameActive: { color: Colors.brandGreen, fontWeight: '700' },
  miqatRowSub: { fontSize: 11, color: Colors.textPrimary, opacity: 0.45 },
  nextBtn: { backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
