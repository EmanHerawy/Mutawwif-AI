import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import type { Gender, RitualType, MobilityLevel, DialectKey } from '../../src/types/persona.types';

export default function PersonaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, updatePersona } = usePersonaStore();

  const [name, setName] = useState(persona?.name ?? '');
  const [gender, setGender] = useState<Gender>(persona?.gender ?? 'male');
  const [ritualType, setRitualType] = useState<RitualType>(persona?.ritualType ?? 'umrah');
  const [hajjIntent, setHajjIntent] = useState<'umrah' | 'hajj'>(
    (persona?.ritualType ?? 'umrah') === 'umrah' ? 'umrah' : 'hajj'
  );
  const [mobility, setMobility] = useState<MobilityLevel>(persona?.mobilityLevel ?? 'standard');
  const [error, setError] = useState('');

  const HAJJ_SUBTYPES: { value: RitualType; label: string; hint: string; recommended?: boolean }[] = [
    { value: 'hajj_tamattu', label: t('onboarding.persona_hajj_tamattu'), hint: t('onboarding.ritual_tamattu_hint'), recommended: true },
    { value: 'hajj_qiran', label: t('onboarding.persona_hajj_qiran'), hint: t('onboarding.ritual_qiran_hint') },
    { value: 'hajj_ifrad', label: t('onboarding.persona_hajj_ifrad'), hint: t('onboarding.ritual_ifrad_hint') },
  ];

  const handleIntentSelect = (intent: 'umrah' | 'hajj') => {
    setHajjIntent(intent);
    if (intent === 'umrah') setRitualType('umrah');
    else if (ritualType === 'umrah') setRitualType('hajj_tamattu'); // safe default
  };

  const MOBILITY_OPTIONS: { value: MobilityLevel; label: string }[] = [
    { value: 'standard', label: t('onboarding.persona_mobility_standard') },
    { value: 'reduced', label: t('onboarding.persona_mobility_reduced') },
    { value: 'wheelchair', label: t('onboarding.persona_mobility_wheelchair') },
  ];

  const handleNext = () => {
    if (!name.trim()) { setError(t('onboarding.persona_name_required')); return; }
    const langCode = persona?.languageCode ?? 'en';
    const dialectKey: DialectKey = 'standard_arabic';
    updatePersona({ name: name.trim(), gender, ritualType, mobilityLevel: mobility, languageCode: langCode, dialectKey, nationalityCode: '' });
    router.push('/(onboarding)/identity');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.step}>2 / 4</Text>
            <Text style={styles.title}>{t('onboarding.persona_title')}</Text>
          </View>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('onboarding.persona_name')}</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={name}
              onChangeText={(v) => { setName(v); setError(''); }}
              placeholder={t('onboarding.persona_name_placeholder')}
              placeholderTextColor={Colors.textPrimary + '55'}
              returnKeyType="next"
            />
            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Gender */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('onboarding.persona_gender')}</Text>
            <View style={styles.toggleRow}>
              {(['male', 'female'] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.toggleBtn, gender === g && styles.toggleActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.toggleText, gender === g && styles.toggleTextActive]}>
                    {g === 'male' ? `♂ ${t('onboarding.persona_male')}` : `♀ ${t('onboarding.persona_female')}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ritual Type — Tier 1: intent */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('onboarding.ritual_intent_label')}</Text>
            <View style={styles.intentRow}>
              {(['umrah', 'hajj'] as const).map((intent) => (
                <TouchableOpacity
                  key={intent}
                  style={[styles.intentCard, hajjIntent === intent && styles.intentCardActive]}
                  onPress={() => handleIntentSelect(intent)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.intentEmoji}>{intent === 'umrah' ? '🌙' : '🕋'}</Text>
                  <Text style={[styles.intentLabel, hajjIntent === intent && styles.intentLabelActive]}>
                    {intent === 'umrah' ? t('onboarding.persona_umrah') : 'Hajj / حج'}
                  </Text>
                  <Text style={[styles.intentSub, hajjIntent === intent && styles.intentSubActive]}>
                    {intent === 'umrah' ? t('onboarding.ritual_umrah_subtitle') : t('onboarding.ritual_hajj_subtitle')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tier 2: Hajj subtype — only shown when Hajj is selected */}
            {hajjIntent === 'hajj' && (
              <View style={styles.subtypeBox}>
                <Text style={styles.subtypeLabel}>{t('onboarding.ritual_subtype_label')}</Text>
                {HAJJ_SUBTYPES.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.optionBtn, ritualType === opt.value && styles.optionActive]}
                    onPress={() => setRitualType(opt.value)}
                  >
                    <View style={[styles.radio, ritualType === opt.value && styles.radioActive]} />
                    <View style={{ flex: 1 }}>
                      <View style={styles.subtypeNameRow}>
                        <Text style={[styles.optionText, ritualType === opt.value && styles.optionTextActive]}>
                          {opt.label}
                        </Text>
                        {opt.recommended && (
                          <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>{t('onboarding.ritual_recommended')}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.subtypeHint}>{opt.hint}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setRitualType('hajj_tamattu')} style={styles.unsureBtn}>
                  <Text style={styles.unsureText}>{t('onboarding.ritual_unsure')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Mobility */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('onboarding.persona_mobility')}</Text>
            <View style={styles.optionList}>
              {MOBILITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, mobility === opt.value && styles.optionActive]}
                  onPress={() => setMobility(opt.value)}
                >
                  <View style={[styles.radio, mobility === opt.value && styles.radioActive]} />
                  <Text style={[styles.optionText, mobility === opt.value && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen },
  field: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, opacity: 0.7 },
  input: {
    backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  toggleRow: { flexDirection: 'row', gap: 12 },
  toggleBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5,
    borderColor: Colors.brandGreen + '33', alignItems: 'center', backgroundColor: Colors.white,
  },
  toggleActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  toggleText: { fontSize: 15, fontWeight: '600', color: Colors.brandGreen },
  toggleTextActive: { color: Colors.white },
  optionList: { gap: 8 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33', backgroundColor: Colors.white, gap: 12,
  },
  optionActive: { borderColor: Colors.brandGreen, backgroundColor: Colors.brandGreen + '0D' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.brandGreen + '66' },
  radioActive: { borderColor: Colors.brandGreen, backgroundColor: Colors.brandGreen },
  optionText: { fontSize: 15, color: Colors.textPrimary },
  optionTextActive: { color: Colors.brandGreen, fontWeight: '600' },
  intentRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  intentCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  intentCardActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  intentEmoji: { fontSize: 28, marginBottom: 6 },
  intentLabel: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 3, textAlign: 'center' },
  intentLabelActive: { color: Colors.white },
  intentSub: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, textAlign: 'center', lineHeight: 15 },
  intentSubActive: { color: Colors.white, opacity: 0.8 },
  subtypeBox: {
    marginTop: 12, backgroundColor: Colors.brandGreen + '06',
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: Colors.brandGreen + '22', gap: 6,
  },
  subtypeLabel: { fontSize: 12, fontWeight: '700', color: Colors.brandGreen, opacity: 0.6, marginBottom: 4 },
  subtypeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  subtypeHint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, marginTop: 2, lineHeight: 16 },
  recommendedBadge: { backgroundColor: Colors.goldAccent + '30', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  recommendedText: { fontSize: 10, color: Colors.goldAccent, fontWeight: '700' },
  unsureBtn: { paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  unsureText: { fontSize: 12, color: Colors.goldAccent, fontWeight: '600', textAlign: 'center' },
  nextBtn: { backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  nextText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
