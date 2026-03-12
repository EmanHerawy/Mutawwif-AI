import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useRitualStore } from '../../src/stores/ritualStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { useHealthStore } from '../../src/stores/healthStore';
import { Colors } from '../../src/theme/colors';

import { isHajjSeason } from '../../src/utils/hajjSeason';
import ScreenBackground from '../../src/components/ScreenBackground';

const HEAT_COLORS: Record<string, string> = {
  caution: Colors.goldAccent,
  danger: Colors.warning,
  extreme: Colors.danger,
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
  const isHajjType = persona?.ritualType && persona.ritualType !== 'umrah';
  const hajjAllowed = isHajjSeason();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {name ? `${t('recovery.title')}, ${name} 👋` : '🕋 Mutawwif'}
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/settings')}>
              <Text style={styles.headerBtnText}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.headerBtnText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status banners */}
        {heatStatus !== 'normal' && HEAT_COLORS[heatStatus] && (
          <View style={[styles.banner, { borderColor: HEAT_COLORS[heatStatus] }]}>
            <Text style={[styles.bannerText, { color: HEAT_COLORS[heatStatus] }]}>
              {t(`heat.${heatStatus}_title`)}
              {currentTemp !== null ? `  ${currentTemp}°C` : ''}
            </Text>
          </View>
        )}
        {(miqatStatus === 'approaching_50km' || miqatStatus === 'approaching_10km') && (
          <View style={[styles.banner, { borderColor: Colors.goldAccent }]}>
            <Text style={[styles.bannerText, { color: Colors.goldAccent }]}>
              {miqatStatus === 'approaching_10km' ? `⚠️ ${t('miqat.approaching_10')}` : `📍 ${t('miqat.approaching_50')}`}
            </Text>
          </View>
        )}
        {ihramState === 'worn' && (
          <View style={[styles.banner, { borderColor: Colors.brandGreen, backgroundColor: Colors.brandGreen + '10' }]}>
            <Text style={[styles.bannerText, { color: Colors.brandGreen }]}>✅ {t('miqat.ihram_active')}</Text>
          </View>
        )}

        {/* Active ritual resume */}
        {counter && isActive && (
          <TouchableOpacity style={styles.activeCard} onPress={() => router.push('/(tabs)/tracker')}>
            <View>
              <Text style={styles.activeCardLabel}>
                {counter.ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai')} · {t('recovery.subtitle')}
              </Text>
              <Text style={styles.activeCardProgress}>{counter.completedLaps} / 7 {t('tracker.round')}</Text>
            </View>
            <Text style={styles.activeCardArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* ── GROUP 1: Start a ritual ── */}
        <Text style={styles.sectionLabel}>{t('dashboard_ui.start')}</Text>
        <View style={styles.ritualGroup}>

          {/* Start Umrah — always available */}
          <TouchableOpacity
            style={styles.ritualCard}
            onPress={() => router.push('/(tabs)/guide')}
          >
            <Text style={styles.ritualEmoji}>🕋</Text>
            <View style={styles.ritualCardContent}>
              <Text style={styles.ritualCardTitle}>{t('guide.start_umrah')}</Text>
              <Text style={styles.ritualCardSub}>{t('onboarding.persona_umrah')}</Text>
            </View>
            <Text style={styles.ritualCardArrow}>→</Text>
          </TouchableOpacity>

          {/* Start Hajj — only during Hajj months */}
          <TouchableOpacity
            style={[styles.ritualCard, !hajjAllowed && styles.ritualCardDisabled]}
            onPress={() => hajjAllowed && router.push('/(tabs)/guide')}
            activeOpacity={hajjAllowed ? 0.7 : 1}
          >
            <Text style={styles.ritualEmoji}>🕌</Text>
            <View style={styles.ritualCardContent}>
              <Text style={[styles.ritualCardTitle, !hajjAllowed && styles.textMuted]}>
                {t('guide.start_hajj')}
              </Text>
              <Text style={[styles.ritualCardSub, !hajjAllowed && styles.textMuted]}>
                {hajjAllowed ? t('onboarding.ritual_hajj_subtitle') : t('guide.hajj_season_msg')}
              </Text>
            </View>
            {hajjAllowed
              ? <Text style={styles.ritualCardArrow}>→</Text>
              : <View style={styles.lockedBadge}><Text style={styles.lockedBadgeText}>🔒</Text></View>
            }
          </TouchableOpacity>

        </View>

        {/* ── GROUP 2: Tools ── */}
        <Text style={styles.sectionLabel}>{t('tabs.azkar') + ' & ' + t('tabs.guide')}</Text>
        <View style={styles.toolsGrid}>
          {[
            { emoji: '📿', label: t('tabs.azkar'), route: '/(tabs)/azkar' },
            { emoji: '📖', label: t('tabs.guide'), route: '/(tabs)/guide' },
            { emoji: '💬', label: t('tabs.ask'), route: '/(tabs)/ask' },
            { emoji: '🆔', label: t('wallet.title'), route: '/(tabs)/wallet' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.toolCard}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.toolEmoji}>{item.emoji}</Text>
              <Text style={styles.toolLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {miqatAssignment && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{t('miqat.assigned', { name: miqatAssignment })}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, flex: 1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  headerBtnText: { fontSize: 18 },
  banner: { borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: Colors.white },
  bannerText: { fontSize: 14, fontWeight: '600' },
  activeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.brandGreen, borderRadius: 16, padding: 18, marginBottom: 20,
  },
  activeCardLabel: { fontSize: 13, color: Colors.white, opacity: 0.8, marginBottom: 4 },
  activeCardProgress: { fontSize: 20, fontWeight: '700', color: Colors.white },
  activeCardArrow: { fontSize: 22, color: Colors.white },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, opacity: 0.4, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  // Ritual group
  ritualGroup: { gap: 10, marginBottom: 28 },
  ritualCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  ritualCardDisabled: { borderColor: Colors.textPrimary + '18', backgroundColor: Colors.parchmentBg },
  ritualEmoji: { fontSize: 32 },
  ritualCardContent: { flex: 1 },
  ritualCardTitle: { fontSize: 17, fontWeight: '700', color: Colors.brandGreen, marginBottom: 3 },
  ritualCardSub: { fontSize: 12, color: Colors.textPrimary, opacity: 0.55 },
  ritualCardArrow: { fontSize: 20, color: Colors.brandGreen },
  textMuted: { color: Colors.textPrimary, opacity: 0.4 },
  lockedBadge: { paddingHorizontal: 8, paddingVertical: 4 },
  lockedBadgeText: { fontSize: 18 },
  // Tools grid
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  toolCard: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
  },
  toolEmoji: { fontSize: 26, marginBottom: 6 },
  toolLabel: { fontSize: 12, fontWeight: '600', color: Colors.brandGreen, textAlign: 'center' },
  infoCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.brandGreen + '22' },
  infoText: { fontSize: 13, color: Colors.textPrimary, opacity: 0.6 },
});
