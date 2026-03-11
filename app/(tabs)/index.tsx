import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useRitualStore } from '../../src/stores/ritualStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { useHealthStore } from '../../src/stores/healthStore';
import { Colors } from '../../src/theme/colors';

const RITUAL_LABELS: Record<string, string> = {
  umrah: 'Umrah · عمرة',
  hajj_tamattu: "Hajj Tamattu' · حج التمتع",
  hajj_qiran: 'Hajj Qiran · حج القران',
  hajj_ifrad: 'Hajj Ifrad · حج الإفراد',
};

const HEAT_COLORS: Record<string, string> = {
  caution: Colors.goldAccent,
  danger: Colors.warning,
  extreme: Colors.danger,
};

const HEAT_LABELS: Record<string, string> = {
  caution: '☀️ Stay hydrated',
  danger: '🌡️ Extreme heat — drink water now',
  extreme: '🚨 Seek shade immediately',
};

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const counter = useRitualStore((s) => s.counter);
  const isActive = useRitualStore((s) => s.isActive);
  const miqatStatus = useLocationStore((s) => s.miqatStatus);
  const miqatAssignment = useLocationStore((s) => s.miqatAssignment);
  const ihramState = useLocationStore((s) => s.ihramState);
  const heatStatus = useHealthStore((s) => s.heatStatus);
  const currentTemp = useHealthStore((s) => s.currentTempCelsius);

  const name = persona?.name ?? '';
  const ritualLabel = persona?.ritualType ? RITUAL_LABELS[persona.ritualType] : '';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {name ? `${t('recovery.title')}, ${name} 👋` : '🕋 Mutawwif'}
          </Text>
          {!!ritualLabel && (
            <View style={styles.ritualBadge}>
              <Text style={styles.ritualBadgeText}>{ritualLabel}</Text>
            </View>
          )}
        </View>

        {/* Heat alert */}
        {heatStatus !== 'normal' && HEAT_LABELS[heatStatus] && (
          <View style={[styles.banner, { borderColor: HEAT_COLORS[heatStatus] }]}>
            <Text style={[styles.bannerText, { color: HEAT_COLORS[heatStatus] }]}>
              {HEAT_LABELS[heatStatus]}
              {currentTemp !== null ? `  ${currentTemp}°C` : ''}
            </Text>
          </View>
        )}

        {/* Miqat approaching */}
        {(miqatStatus === 'approaching_50' || miqatStatus === 'approaching_10') && (
          <View style={[styles.banner, { borderColor: Colors.goldAccent }]}>
            <Text style={[styles.bannerText, { color: Colors.goldAccent }]}>
              {miqatStatus === 'approaching_10'
                ? `⚠️ ${t('miqat.approaching_10')}`
                : `📍 ${t('miqat.approaching_50')}`}
            </Text>
          </View>
        )}

        {/* Ihram active */}
        {ihramState === 'worn' && (
          <View style={[styles.banner, { borderColor: Colors.brandGreen, backgroundColor: Colors.brandGreen + '10' }]}>
            <Text style={[styles.bannerText, { color: Colors.brandGreen }]}>✅ {t('miqat.ihram_active')}</Text>
          </View>
        )}

        {/* Active ritual — resume card */}
        {counter && isActive && (
          <TouchableOpacity style={styles.activeCard} onPress={() => router.push('/(tabs)/tracker')}>
            <View>
              <Text style={styles.activeCardLabel}>
                {counter.ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai')} · {t('recovery.subtitle')}
              </Text>
              <Text style={styles.activeCardProgress}>
                {counter.completedLaps} / 7 {t('tracker.round')}
              </Text>
            </View>
            <Text style={styles.activeCardArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>
          {(persona?.languageCode ?? 'en').startsWith('ar') ? 'ابدأ' : 'Start'}
        </Text>
        <View style={styles.actionGrid}>
          {[
            { emoji: '🕋', label: t('tracker.tawaf'), route: '/(tabs)/tracker' },
            { emoji: '🏃', label: t('tracker.sai'), route: '/(tabs)/tracker' },
            { emoji: '📖', label: t('tabs.guide'), route: '/(tabs)/guide' },
            { emoji: '💬', label: t('tabs.ask'), route: '/(tabs)/ask' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.actionCard}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.actionEmoji}>{item.emoji}</Text>
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Miqat info */}
        {miqatAssignment && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{t('miqat.assigned', { name: miqatAssignment })}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, marginBottom: 8 },
  ritualBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.brandGreen + '18',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  ritualBadgeText: { fontSize: 13, color: Colors.brandGreen, fontWeight: '600' },
  banner: {
    borderWidth: 1.5, borderRadius: 12, padding: 12,
    marginBottom: 12, backgroundColor: Colors.white,
  },
  bannerText: { fontSize: 14, fontWeight: '600' },
  activeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.brandGreen, borderRadius: 16, padding: 18, marginBottom: 20,
  },
  activeCardLabel: { fontSize: 13, color: Colors.white, opacity: 0.8, marginBottom: 4 },
  activeCardProgress: { fontSize: 20, fontWeight: '700', color: Colors.white },
  activeCardArrow: { fontSize: 22, color: Colors.white },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, opacity: 0.45, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  actionEmoji: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen, textAlign: 'center' },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: Colors.brandGreen + '22',
  },
  infoText: { fontSize: 14, color: Colors.textPrimary, opacity: 0.65 },
});
