import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, I18nManager, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import i18n from '../../src/i18n/config';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import ScreenBackground from '../../src/components/ScreenBackground';

const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'Arabic',        nativeLabel: 'العربية',       flag: '🇸🇦', rtl: true  },
  { code: 'en', label: 'English',       nativeLabel: 'English',       flag: '🇬🇧', rtl: false },
  { code: 'ur', label: 'Urdu',          nativeLabel: 'اردو',          flag: '🇵🇰', rtl: true  },
  { code: 'fr', label: 'French',        nativeLabel: 'Français',      flag: '🇫🇷', rtl: false },
  { code: 'ms', label: 'Malay',         nativeLabel: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  { code: 'tr', label: 'Turkish',       nativeLabel: 'Türkçe',        flag: '🇹🇷', rtl: false },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const updatePersona = usePersonaStore((s) => s.updatePersona);
  const currentLang = i18n.language ?? 'en';

  const handleSelectLanguage = (code: string, rtl: boolean) => {
    i18n.changeLanguage(code);
    if (Platform.OS !== 'web') {
      I18nManager.forceRTL(rtl);
    }
    if (persona) {
      updatePersona({ languageCode: code });
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>🌐 {t('settings.language')}</Text>
        <View style={styles.card}>
          {SUPPORTED_LANGUAGES.map((lang, idx) => {
            const isSelected = currentLang.startsWith(lang.code);
            const isLast = idx === SUPPORTED_LANGUAGES.length - 1;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langRow, !isLast && styles.langRowBorder]}
                onPress={() => handleSelectLanguage(lang.code, lang.rtl)}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.langLabels}>
                  <Text style={[styles.nativeLabel, isSelected && styles.selectedText]}>
                    {lang.nativeLabel}
                  </Text>
                  <Text style={styles.englishLabel}>
                    {lang.label}
                    {!['ar', 'en'].includes(lang.code) ? ' *' : ''}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>{t('settings.language_hint')}</Text>

      </ScrollView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
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
    opacity: 0.45, marginBottom: 10, marginTop: 8,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
    overflow: 'hidden',
  },
  langRow: {
    flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14,
  },
  langRowBorder: {
    borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11',
  },
  flag: { fontSize: 28 },
  langLabels: { flex: 1 },
  nativeLabel: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  selectedText: { color: Colors.brandGreen },
  englishLabel: { fontSize: 12, color: Colors.textPrimary, opacity: 0.45 },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.brandGreen, alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  hint: { fontSize: 12, color: Colors.textPrimary, opacity: 0.4, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});
