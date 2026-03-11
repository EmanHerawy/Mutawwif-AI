import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';

// Keyword → Miqat mapping used silently to pre-populate screen 5
export const REGION_MIQAT: { keywords: string[]; miqatId: string }[] = [
  { keywords: ['egypt', 'cairo', 'alex', 'مصر', 'القاهرة', 'jordan', 'morocco', 'tunisia', 'algeria', 'libya', 'europe', 'usa', 'canada', 'uk', 'london', 'paris'], miqatId: 'al_juhfah' },
  { keywords: ['medina', 'madinah', 'المدينة', 'saudi', 'السعودية'], miqatId: 'dhul_hulayfah' },
  { keywords: ['iraq', 'iran', 'العراق', 'إيران', 'kuwait', 'الكويت', 'syria', 'سوريا'], miqatId: 'dhat_irq' },
  { keywords: ['najd', 'riyadh', 'الرياض', 'نجد', 'taif', 'الطائف', 'pakistan', 'india', 'باكستان', 'الهند', 'malaysia', 'ماليزيا', 'indonesia', 'إندونيسيا'], miqatId: 'qarn_al_manazil' },
  { keywords: ['yemen', 'اليمن', 'oman', 'عمان', 'ethiopia', 'إثيوبيا', 'sudan', 'السودان', 'somalia', 'الصومال'], miqatId: 'yalamlam' },
];

export function detectMiqatFromCity(city: string): string | null {
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
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!city.trim()) { setError(t('onboarding.origin_city_required')); return; }
    // Save city — the suggested Miqat is resolved on screen 5
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
              onChangeText={(v) => { setCity(v); setError(''); }}
              placeholder={t('onboarding.origin_city_placeholder')}
              placeholderTextColor={Colors.textPrimary + '55'}
              autoCapitalize="words"
              returnKeyType="done"
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
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
  field: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, opacity: 0.7 },
  input: {
    backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  nextBtn: { backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
