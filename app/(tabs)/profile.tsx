import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useIdentityStore } from '../../src/stores/identityStore';
import { Colors } from '../../src/theme/colors';
import type { Gender, RitualType, MobilityLevel } from '../../src/types/persona.types';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const hydrated = usePersonaStore((s) => s._hydrated);
  const updatePersona = usePersonaStore((s) => s.updatePersona);
  const setPersona = usePersonaStore((s) => s.setPersona);
  const completeOnboarding = usePersonaStore((s) => s.completeOnboarding);
  const nusukIdNumber = useIdentityStore((s) => s.nusukIdNumber);
  const setNusukId = useIdentityStore((s) => s.setNusukId);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [ritualType, setRitualType] = useState<RitualType>('umrah');
  const [mobilityLevel, setMobilityLevel] = useState<MobilityLevel>('standard');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [hotelMakkahName, setHotelMakkahName] = useState('');
  const [hotelMakkahAddress, setHotelMakkahAddress] = useState('');
  const [hotelMadinahName, setHotelMadinahName] = useState('');
  const [hotelMadinahAddress, setHotelMadinahAddress] = useState('');
  const [groupGuideName, setGroupGuideName] = useState('');
  const [groupGuidePhone, setGroupGuidePhone] = useState('');
  const [nusukId, setNusukIdLocal] = useState('');
  const [saved, setSaved] = useState(false);

  // Populate form once hydration is confirmed — this is the only reliable trigger
  useEffect(() => {
    if (!hydrated) return;
    const p = usePersonaStore.getState().persona;
    if (p) {
      setName(p.name ?? '');
      setGender(p.gender ?? 'male');
      setRitualType(p.ritualType ?? 'umrah');
      setMobilityLevel(p.mobilityLevel ?? 'standard');
      setEmergencyName(p.emergencyContactName ?? '');
      setEmergencyPhone(p.emergencyContactPhone ?? '');
      setHotelMakkahName(p.hotelMakkahName ?? '');
      setHotelMakkahAddress(p.hotelMakkahAddress ?? '');
      setHotelMadinahName(p.hotelMadinahName ?? '');
      setHotelMadinahAddress(p.hotelMadinahAddress ?? '');
      setGroupGuideName(p.groupGuideName ?? '');
      setGroupGuidePhone(p.groupGuidePhone ?? '');
    }
    const nusuk = useIdentityStore.getState().nusukIdNumber;
    if (nusuk) setNusukIdLocal(nusuk);
  }, [hydrated]);

  const handleSave = () => {
    if (!name.trim()) {
      if (Platform.OS === 'web') {
        alert(t('onboarding.persona_name_required'));
      } else {
        Alert.alert(t('onboarding.persona_name_required'));
      }
      return;
    }

    const updated = {
      name: name.trim(),
      gender,
      ritualType,
      mobilityLevel,
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
      hotelMakkahName: hotelMakkahName.trim(),
      hotelMakkahAddress: hotelMakkahAddress.trim(),
      hotelMadinahName: hotelMadinahName.trim(),
      hotelMadinahAddress: hotelMadinahAddress.trim(),
      groupGuideName: groupGuideName.trim(),
      groupGuidePhone: groupGuidePhone.trim(),
      nationalityCode: persona?.nationalityCode ?? '',
      languageCode: persona?.languageCode ?? 'en',
      dialectKey: persona?.dialectKey ?? 'standard_arabic',
    };

    if (persona) {
      updatePersona(updated);
    } else {
      setPersona(updated);
      completeOnboarding();
    }

    setNusukId(nusukId.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const RITUAL_TYPES: { id: RitualType; label: string }[] = [
    { id: 'umrah', label: t('onboarding.persona_umrah') },
    { id: 'hajj_tamattu', label: t('onboarding.persona_hajj_tamattu') },
    { id: 'hajj_qiran', label: t('onboarding.persona_hajj_qiran') },
    { id: 'hajj_ifrad', label: t('onboarding.persona_hajj_ifrad') },
  ];

  const MOBILITY_LEVELS: { id: MobilityLevel; label: string }[] = [
    { id: 'standard', label: t('onboarding.persona_mobility_standard') },
    { id: 'reduced', label: t('onboarding.persona_mobility_reduced') },
    { id: 'wheelchair', label: t('onboarding.persona_mobility_wheelchair') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Personal ── */}
        <Text style={styles.sectionLabel}>{t('profile.section_personal')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('onboarding.persona_name')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('onboarding.persona_name_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('onboarding.persona_gender')}</Text>
          <View style={styles.toggleRow}>
            {(['male', 'female'] as Gender[]).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.toggleBtn, gender === g && styles.toggleBtnActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.toggleText, gender === g && styles.toggleTextActive]}>
                  {g === 'male' ? t('onboarding.persona_male') : t('onboarding.persona_female')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Ritual ── */}
        <Text style={styles.sectionLabel}>{t('onboarding.persona_ritual')}</Text>
        <View style={styles.card}>
          <View style={styles.chipGroup}>
            {RITUAL_TYPES.map((rt) => (
              <TouchableOpacity
                key={rt.id}
                style={[styles.chip, ritualType === rt.id && styles.chipActive]}
                onPress={() => setRitualType(rt.id)}
              >
                <Text style={[styles.chipText, ritualType === rt.id && styles.chipTextActive]}>
                  {rt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('onboarding.persona_mobility')}</Text>
          <View style={styles.chipGroup}>
            {MOBILITY_LEVELS.map((ml) => (
              <TouchableOpacity
                key={ml.id}
                style={[styles.chip, mobilityLevel === ml.id && styles.chipActive]}
                onPress={() => setMobilityLevel(ml.id)}
              >
                <Text style={[styles.chipText, mobilityLevel === ml.id && styles.chipTextActive]}>
                  {ml.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Emergency Contact ── */}
        <Text style={styles.sectionLabel}>🚨 {t('onboarding.emergency_section')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('onboarding.identity_emergency_name')}</Text>
          <TextInput
            style={styles.input}
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholder={t('profile.emergency_name_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('onboarding.identity_emergency_phone')}</Text>
          <TextInput
            style={styles.input}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            placeholder="+1-555-000-0000"
            placeholderTextColor={Colors.textPrimary + '55'}
            keyboardType="phone-pad"
          />
        </View>

        {/* ── Group Guide ── */}
        <Text style={styles.sectionLabel}>👤 {t('profile.section_guide')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('profile.guide_name')}</Text>
          <TextInput
            style={styles.input}
            value={groupGuideName}
            onChangeText={setGroupGuideName}
            placeholder={t('profile.guide_name_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('profile.guide_phone')}</Text>
          <TextInput
            style={styles.input}
            value={groupGuidePhone}
            onChangeText={setGroupGuidePhone}
            placeholder="+966-5xx-xxx-xxxx"
            placeholderTextColor={Colors.textPrimary + '55'}
            keyboardType="phone-pad"
          />
        </View>

        {/* ── Hotel Makkah ── */}
        <Text style={styles.sectionLabel}>🕋 {t('wallet.hotel_makkah')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('onboarding.identity_hotel_name')}</Text>
          <TextInput
            style={styles.input}
            value={hotelMakkahName}
            onChangeText={setHotelMakkahName}
            placeholder={t('onboarding.identity_hotel_name_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('onboarding.identity_hotel_address')}</Text>
          <TextInput
            style={styles.input}
            value={hotelMakkahAddress}
            onChangeText={setHotelMakkahAddress}
            placeholder={t('onboarding.identity_hotel_address_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
        </View>

        {/* ── Hotel Madinah ── */}
        <Text style={styles.sectionLabel}>🕌 {t('wallet.hotel_madinah')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('onboarding.identity_hotel_name')}</Text>
          <TextInput
            style={styles.input}
            value={hotelMadinahName}
            onChangeText={setHotelMadinahName}
            placeholder={t('onboarding.identity_hotel_name_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>{t('onboarding.identity_hotel_address')}</Text>
          <TextInput
            style={styles.input}
            value={hotelMadinahAddress}
            onChangeText={setHotelMadinahAddress}
            placeholder={t('onboarding.identity_hotel_address_placeholder')}
            placeholderTextColor={Colors.textPrimary + '55'}
          />
        </View>

        {/* ── Documents ── */}
        <Text style={styles.sectionLabel}>🆔 {t('onboarding.nusuk_id_section')}</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>{t('onboarding.identity_nusuk_id')}</Text>
          <TextInput
            style={styles.input}
            value={nusukId}
            onChangeText={setNusukIdLocal}
            placeholder="e.g. NUS-123456789"
            placeholderTextColor={Colors.textPrimary + '55'}
            autoCapitalize="characters"
          />
          <Text style={styles.hint}>{t('onboarding.identity_nusuk_hint')}</Text>
        </View>

        <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={handleSave}>
          <Text style={styles.saveBtnText}>
            {saved ? `✓ ${t('profile.saved')}` : t('profile.save')}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '18',
    backgroundColor: Colors.white,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  backText: { fontSize: 22, color: Colors.brandGreen },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.brandGreen },
  scroll: { padding: 20, paddingBottom: 48 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textPrimary,
    opacity: 0.45, marginBottom: 10, marginTop: 20,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, opacity: 0.55, marginBottom: 8 },
  input: {
    backgroundColor: Colors.parchmentBg, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
    color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  hint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.4, marginTop: 8, lineHeight: 16 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
    backgroundColor: Colors.parchmentBg, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  toggleBtnActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.brandGreen },
  toggleTextActive: { color: Colors.white },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.parchmentBg, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  chipActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  chipTextActive: { color: Colors.white },
  saveBtn: {
    marginTop: 28, backgroundColor: Colors.brandGreen, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
  },
  saveBtnDone: { backgroundColor: Colors.brandGreen + 'CC' },
  saveBtnText: { color: Colors.white, fontSize: 17, fontWeight: '800' },
});
