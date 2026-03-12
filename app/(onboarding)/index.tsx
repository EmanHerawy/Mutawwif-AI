import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { initI18n } from '../../src/i18n/config';
import { usePersonaStore } from '../../src/stores/personaStore';
import { Colors } from '../../src/theme/colors';
import ScreenBackground from '../../src/components/ScreenBackground';

const LANGUAGES = [
  { code: 'ar', label: 'العربية', sublabel: 'Arabic', flag: '🇸🇦' },
  { code: 'en', label: 'English', sublabel: 'الإنجليزية', flag: '🇬🇧' },
  { code: 'ur', label: 'اردو', sublabel: 'Urdu', flag: '🇵🇰' },
  { code: 'fr', label: 'Français', sublabel: 'الفرنسية', flag: '🇫🇷' },
  { code: 'ms', label: 'Bahasa Melayu', sublabel: 'الملايو', flag: '🇲🇾' },
  { code: 'tr', label: 'Türkçe', sublabel: 'التركية', flag: '🇹🇷' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const updatePersona = usePersonaStore((s) => s.updatePersona);

  const handleSelect = async (code: string) => {
    await initI18n(code);
    updatePersona({ languageCode: code });
    router.push('/(onboarding)/persona');
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>اختر لغتك{'\n'}Choose Language</Text>
          <Text style={styles.subtitle}>Select the language for your pilgrimage guide</Text>
        </View>
        <View style={styles.grid}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.card}
              onPress={() => handleSelect(lang.code)}
              activeOpacity={0.75}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.langLabel}>{lang.label}</Text>
              <Text style={styles.langSub}>{lang.sublabel}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 48 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.brandGreen, textAlign: 'center', marginBottom: 8, lineHeight: 36 },
  subtitle: { fontSize: 15, color: Colors.textPrimary, opacity: 0.6, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  card: {
    width: '44%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.brandGreen + '22',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  flag: { fontSize: 32, marginBottom: 8 },
  langLabel: { fontSize: 17, fontWeight: '600', color: Colors.brandGreen, marginBottom: 2 },
  langSub: { fontSize: 12, color: Colors.textPrimary, opacity: 0.5 },
});
