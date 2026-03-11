import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';

export default function IdentityScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { persona, updatePersona } = usePersonaStore();

  const [nusukId, setNusukId] = useState('');
  const [emergencyName, setEmergencyName] = useState(persona?.emergencyContactName ?? '');
  const [emergencyPhone, setEmergencyPhone] = useState(persona?.emergencyContactPhone ?? '');
  const [hotelName, setHotelName] = useState(persona?.hotelName ?? '');
  const [hotelAddress, setHotelAddress] = useState(persona?.hotelAddress ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format-only validation — nothing is required
  const validate = () => {
    const e: Record<string, string> = {};
    if (nusukId.trim() && !/^[A-Za-z0-9\-]{3,30}$/.test(nusukId.trim())) {
      e.nusukId = t('onboarding.validation_nusuk_invalid');
    }
    if (emergencyPhone.trim() && !/^\+?[\d\s\-()\u0660-\u0669]{7,20}$/.test(emergencyPhone.trim())) {
      e.emergencyPhone = t('onboarding.validation_phone_invalid');
    }
    return e;
  };

  const clearError = (key: string) => setErrors((prev) => ({ ...prev, [key]: '' }));

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).filter((k) => e[k]).length > 0) { setErrors(e); return; }
    updatePersona({
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
      hotelName: hotelName.trim(),
      hotelAddress: hotelAddress.trim(),
    });
    router.push('/(onboarding)/miqat-info');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.step}>4 / 5</Text>
            <Text style={styles.title}>{t('onboarding.identity_title')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.identity_subtitle')}</Text>
          </View>

          {/* Nusuk ID */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🆔 {t('onboarding.nusuk_id_section')}</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>{t('onboarding.identity_optional')}</Text>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t('onboarding.identity_nusuk_id')}</Text>
              <TextInput
                style={[styles.input, errors.nusukId ? styles.inputError : null]}
                value={nusukId}
                onChangeText={(v) => { setNusukId(v); clearError('nusukId'); }}
                placeholder="e.g. NUS-123456789"
                placeholderTextColor={Colors.textPrimary + '55'}
                autoCapitalize="characters"
              />
              {!!errors.nusukId && <Text style={styles.errorText}>{errors.nusukId}</Text>}
            </View>
            <Text style={styles.hint}>{t('onboarding.identity_nusuk_hint')}</Text>
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🚨 {t('onboarding.emergency_section')}</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>{t('onboarding.identity_recommended')}</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('onboarding.identity_emergency_name')}</Text>
              <TextInput
                style={styles.input}
                value={emergencyName}
                onChangeText={setEmergencyName}
                placeholder={t('onboarding.persona_name_placeholder')}
                placeholderTextColor={Colors.textPrimary + '55'}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('onboarding.identity_emergency_phone')}</Text>
              <TextInput
                style={[styles.input, errors.emergencyPhone ? styles.inputError : null]}
                value={emergencyPhone}
                onChangeText={(v) => { setEmergencyPhone(v); clearError('emergencyPhone'); }}
                placeholder="+1-555-000-0000"
                placeholderTextColor={Colors.textPrimary + '55'}
                keyboardType="phone-pad"
              />
              {!!errors.emergencyPhone && <Text style={styles.errorText}>{errors.emergencyPhone}</Text>}
            </View>
          </View>

          {/* Hotel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏨 {t('onboarding.hotel_section')}</Text>

            <View style={styles.field}>
              <Text style={styles.label}>{t('onboarding.identity_hotel_name')}</Text>
              <TextInput
                style={styles.input}
                value={hotelName}
                onChangeText={setHotelName}
                placeholder={t('onboarding.identity_hotel_name_placeholder')}
                placeholderTextColor={Colors.textPrimary + '55'}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('onboarding.identity_hotel_address')}</Text>
              <TextInput
                style={styles.input}
                value={hotelAddress}
                onChangeText={setHotelAddress}
                placeholder={t('onboarding.identity_hotel_address_placeholder')}
                placeholderTextColor={Colors.textPrimary + '55'}
              />
            </View>
            <Text style={styles.hint}>{t('onboarding.identity_hotel_hint')}</Text>
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
  header: { marginBottom: 28 },
  step: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textPrimary, opacity: 0.6 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen },
  optionalBadge: {
    backgroundColor: Colors.brandGreen + '15', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  optionalBadgeText: { fontSize: 11, color: Colors.brandGreen, fontWeight: '600' },
  recommendedBadge: {
    backgroundColor: Colors.goldAccent + '25', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  recommendedBadgeText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '600' },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6, opacity: 0.7 },
  input: {
    backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  hint: { fontSize: 12, color: Colors.textPrimary, opacity: 0.5, lineHeight: 18 },
  nextBtn: { backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  nextText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
