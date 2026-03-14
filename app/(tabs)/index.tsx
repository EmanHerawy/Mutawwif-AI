import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons'; // still used by cards below
import { usePersonaStore } from '../../src/stores/personaStore';
import { useRitualStore } from '../../src/stores/ritualStore';
import { useLocationStore } from '../../src/stores/locationStore';
import { useHealthStore } from '../../src/stores/healthStore';
import { Colors } from '../../src/theme/colors';
import { isHajjSeason } from '../../src/utils/hajjSeason';

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
  const hajjAllowed = isHajjSeason();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {name ? `${t('dashboard_ui.greeting')}, ${name} 👋` : '🕋 Mutawwif'}
          </Text>
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
                {counter.ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai')} · {t('dashboard_ui.active_ritual')}
              </Text>
              <Text style={styles.activeCardProgress}>{counter.completedLaps} / 7 {t('tracker.round')}</Text>
            </View>
            <FontAwesome5 name="arrow-right" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* ── GROUP 1: Start a ritual ── */}
        <Text style={styles.sectionLabel}>{t('dashboard_ui.start')}</Text>
        <View style={styles.ritualGroup}>

          {/* Start Umrah */}
          <TouchableOpacity
            style={styles.ritualCard}
            onPress={() => router.push('/(tabs)/guide')}
          >
            <View style={styles.iconBox}>
              <FontAwesome5 name="kaaba" size={26} color={Colors.brandGreen} solid />
            </View>
            <View style={styles.ritualCardContent}>
              <Text style={styles.ritualCardTitle}>{t('guide.start_umrah')}</Text>
              <Text style={styles.ritualCardSub}>{t('onboarding.persona_umrah')}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={Colors.brandGreen} />
          </TouchableOpacity>

          {/* Start Hajj — only during Hajj months */}
          <TouchableOpacity
            style={[styles.ritualCard, !hajjAllowed && styles.ritualCardDisabled]}
            onPress={() => hajjAllowed && router.push('/(tabs)/guide')}
            activeOpacity={hajjAllowed ? 0.7 : 1}
          >
            <View style={[styles.iconBox, !hajjAllowed && styles.iconBoxMuted]}>              
              <FontAwesome5 name="kaaba" size={26} color={hajjAllowed ? Colors.brandGreen : Colors.textPrimary} solid />
            </View>
            <View style={styles.ritualCardContent}>
              <Text style={[styles.ritualCardTitle, !hajjAllowed && styles.textMuted]}>
                {t('guide.start_hajj')}
              </Text>
              <Text style={[styles.ritualCardSub, !hajjAllowed && styles.textMuted]}>
                {hajjAllowed ? t('onboarding.ritual_hajj_subtitle') : t('guide.hajj_season_msg')}
              </Text>
            </View>
            {hajjAllowed
              ? <FontAwesome5 name="chevron-right" size={14} color={Colors.brandGreen} />
              : <FontAwesome5 name="lock" size={14} color={Colors.textPrimary} style={{ opacity: 0.3 }} />
            }
          </TouchableOpacity>

        </View>

        {/* ── GROUP 2: Visit ── */}
        <Text style={styles.sectionLabel}>{t('dashboard_ui.visit')}</Text>
        <View style={styles.ritualGroup}>

          {/* Visit Masjid Al Haram */}
          <TouchableOpacity
            style={styles.ritualCard}
            onPress={() => router.push('/(visit)/haram' as any)}
          >
            <View style={styles.iconBox}>
              <FontAwesome5 name="mosque" size={26} color={Colors.brandGreen} solid />
            </View>
            <View style={styles.ritualCardContent}>
              <Text style={styles.ritualCardTitle}>{t('dashboard_ui.visit_haram_title')}</Text>
              <Text style={styles.ritualCardSub}>{t('dashboard_ui.visit_haram_sub')}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={Colors.brandGreen} />
          </TouchableOpacity>

          {/* Visit Masjid Al Nabawi */}
          <TouchableOpacity
            style={styles.ritualCard}
            onPress={() => router.push('/(visit)/nabawi' as any)}
          >
            <View style={styles.iconBox}>
              <FontAwesome5 name="place-of-worship" size={26} color={Colors.brandGreen} solid />
            </View>
            <View style={styles.ritualCardContent}>
              <Text style={styles.ritualCardTitle}>{t('dashboard_ui.visit_nabawi_title')}</Text>
              <Text style={styles.ritualCardSub}>{t('dashboard_ui.visit_nabawi_sub')}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={Colors.brandGreen} />
          </TouchableOpacity>


        </View>

        {/* ── GROUP 3: Tools ── */}
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

        {/* ── GROUP 4: Learn ── */}
        <Text style={styles.sectionLabel}>{t('tabs.learn')}</Text>
        <View style={styles.ritualGroup}>
          <TouchableOpacity
            style={styles.learnCard}
            onPress={() => router.push('/(learn)/etiquette' as any)}
          >
            <Text style={styles.learnEmoji}>📜</Text>
            <View style={styles.learnContent}>
              <Text style={styles.learnTitle}>{t('etiquette.title')}</Text>
              <Text style={styles.learnSub}>{t('etiquette.subtitle')}</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={Colors.goldAccent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.learnCard}
            onPress={() => router.push('/(learn)/prophet' as any)}
          >
            <Text style={styles.learnEmoji}>✦</Text>
            <View style={styles.learnContent}>
              <Text style={styles.learnTitle}>اعرف نبيك ﷺ</Text>
              <Text style={styles.learnSub}>Know Your Prophet</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={Colors.goldAccent} />
          </TouchableOpacity>
        </View>

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
  greeting: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen },
  banner: { borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 10, backgroundColor: Colors.white },
  bannerText: { fontSize: 14, fontWeight: '600' },
  activeCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.brandGreen, borderRadius: 16, padding: 18, marginBottom: 20,
  },
  activeCardLabel: { fontSize: 13, color: Colors.white, opacity: 0.8, marginBottom: 4 },
  activeCardProgress: { fontSize: 20, fontWeight: '700', color: Colors.white },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textPrimary,
    opacity: 0.4, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  // Ritual / Visit cards
  ritualGroup: { gap: 10, marginBottom: 28 },
  ritualCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
  },
  ritualCardDisabled: { borderColor: Colors.textPrimary + '18', backgroundColor: Colors.parchmentBg },
  // Icon containers
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.brandGreen + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBoxMuted: { backgroundColor: Colors.textPrimary + '08' },
  ritualCardContent: { flex: 1 },
  ritualCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.brandGreen, marginBottom: 3 },
  ritualCardSub: { fontSize: 12, color: Colors.textPrimary, opacity: 0.55 },
  textMuted: { color: Colors.textPrimary, opacity: 0.4 },
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
  // Learn card
  learnCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    borderWidth: 1.5, borderColor: Colors.goldAccent + '55', marginBottom: 20,
  },
  learnEmoji: { fontSize: 32 },
  learnContent: { flex: 1 },
  learnTitle: { fontSize: 16, fontWeight: '700', color: Colors.brandGreen, marginBottom: 3 },
  learnSub: { fontSize: 12, color: Colors.textPrimary, opacity: 0.55 },
});
