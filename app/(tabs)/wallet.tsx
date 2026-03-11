import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useIdentityStore } from '../../src/stores/identityStore';
import { Colors } from '../../src/theme/colors';

type Tab = 'emergency' | 'hotel' | 'nusuk';

export default function WalletScreen() {
  const { t } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const nusukIdNumber = useIdentityStore((s) => s.nusukIdNumber);
  const [tab, setTab] = useState<Tab>('emergency');

  const call = (phone: string) =>
    Linking.openURL(`tel:${phone.replace(/[\s\-()\u202d\u202c]/g, '')}`);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'emergency', label: `🚨 ${t('wallet.emergency_tab')}` },
    { id: 'hotel', label: `🏨 ${t('wallet.hotel_tab')}` },
    { id: 'nusuk', label: `🆔 ${t('wallet.permit_tab')}` },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>{t('wallet.title')}</Text>

        {/* Show-to-driver banner */}
        <View style={styles.driverBanner}>
          <Text style={styles.driverEn}>{t('wallet.show_to_driver')}</Text>
          <Text style={styles.driverAr}>{t('wallet.show_to_driver_ar')}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tp) => (
            <TouchableOpacity
              key={tp.id}
              style={[styles.tabBtn, tab === tp.id && styles.tabBtnActive]}
              onPress={() => setTab(tp.id)}
            >
              <Text style={[styles.tabBtnText, tab === tp.id && styles.tabBtnTextActive]}>
                {tp.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency tab */}
        {tab === 'emergency' && (
          <View style={styles.card}>
            {persona?.name && (
              <View style={styles.pilgrimRow}>
                <Text style={styles.fieldLabel}>Pilgrim</Text>
                <Text style={styles.pilgrimName}>{persona.name}</Text>
              </View>
            )}

            {(persona?.emergencyContactName || persona?.emergencyContactPhone) && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{t('wallet.emergency_contacts')}</Text>
                {persona.emergencyContactName ? (
                  <Text style={styles.contactName}>{persona.emergencyContactName}</Text>
                ) : null}
                {persona.emergencyContactPhone ? (
                  <TouchableOpacity
                    style={styles.callBtn}
                    onPress={() => call(persona.emergencyContactPhone)}
                  >
                    <Text style={styles.callBtnText}>📞 {t('wallet.call')}  {persona.emergencyContactPhone}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Emergency Lines</Text>

            {[
              { emoji: '🏥', title: 'Medical Emergency', phone: t('wallet.medical_emergency') },
              { emoji: '🕌', title: 'Hajj Ministry', phone: t('wallet.hajj_ministry_phone') },
              { emoji: '🛡️', title: 'Haram Security', phone: t('wallet.haram_security') },
            ].map((row) => (
              <TouchableOpacity key={row.title} style={styles.emergencyRow} onPress={() => call(row.phone)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.emergencyTitle}>{row.emoji} {row.title}</Text>
                  <Text style={styles.emergencyPhone}>{row.phone}</Text>
                </View>
                <View style={styles.callChip}>
                  <Text style={styles.callChipText}>{t('wallet.call')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Hotel tab */}
        {tab === 'hotel' && (
          <View style={styles.card}>
            {persona?.hotelName || persona?.hotelAddress ? (
              <>
                {persona.hotelName && <Text style={styles.hotelName}>{persona.hotelName}</Text>}
                {persona.hotelAddress && <Text style={styles.hotelAddress}>{persona.hotelAddress}</Text>}
              </>
            ) : (
              <Text style={styles.emptyNote}>No hotel info saved yet.</Text>
            )}
          </View>
        )}

        {/* Nusuk tab */}
        {tab === 'nusuk' && (
          <View style={styles.card}>
            {nusukIdNumber ? (
              <View style={styles.section}>
                <Text style={styles.fieldLabel}>{t('onboarding.nusuk_id_section')}</Text>
                <Text style={styles.nusukId}>{nusukIdNumber}</Text>
              </View>
            ) : null}
            {persona?.name && (
              <View style={styles.pilgrimRow}>
                <Text style={styles.fieldLabel}>{t('wallet.permit_holder')}</Text>
                <Text style={styles.pilgrimName}>{persona.name}</Text>
              </View>
            )}
            {!nusukIdNumber && !persona?.name && (
              <Text style={styles.emptyNote}>No permit data yet.</Text>
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, marginBottom: 16 },
  driverBanner: {
    backgroundColor: Colors.brandGreen, borderRadius: 14,
    padding: 16, marginBottom: 16, alignItems: 'center',
  },
  driverEn: { fontSize: 13, color: Colors.white, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  driverAr: { fontSize: 13, color: Colors.goldAccent, fontWeight: '600', textAlign: 'center' },
  tabBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  tabBtnActive: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  tabBtnText: { fontSize: 10, fontWeight: '600', color: Colors.brandGreen, textAlign: 'center' },
  tabBtnTextActive: { color: Colors.white },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  pilgrimRow: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, color: Colors.textPrimary, opacity: 0.45, marginBottom: 2, textTransform: 'uppercase' },
  pilgrimName: { fontSize: 20, fontWeight: '700', color: Colors.brandGreen },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen, opacity: 0.55, marginBottom: 10, textTransform: 'uppercase' },
  contactName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  callBtn: {
    backgroundColor: Colors.brandGreen + '12', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  callBtnText: { fontSize: 14, color: Colors.brandGreen, fontWeight: '600' },
  divider: { height: 1, backgroundColor: Colors.brandGreen + '15', marginVertical: 16 },
  emergencyRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11',
  },
  emergencyTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  emergencyPhone: { fontSize: 12, color: Colors.textPrimary, opacity: 0.45 },
  callChip: { backgroundColor: Colors.brandGreen, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  callChipText: { fontSize: 12, color: Colors.white, fontWeight: '700' },
  hotelName: { fontSize: 20, fontWeight: '700', color: Colors.brandGreen, marginBottom: 8 },
  hotelAddress: { fontSize: 14, color: Colors.textPrimary, opacity: 0.65, lineHeight: 22 },
  nusukId: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, letterSpacing: 1 },
  emptyNote: { fontSize: 14, color: Colors.textPrimary, opacity: 0.4, textAlign: 'center', paddingVertical: 20 },
});
