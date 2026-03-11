import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRitualStore } from '../../src/stores/ritualStore';
import { Colors } from '../../src/theme/colors';
import type { RitualCounterType } from '../../src/types/ritual.types';

export default function TrackerScreen() {
  const { t } = useTranslation();
  const counter = useRitualStore((s) => s.counter);
  const isActive = useRitualStore((s) => s.isActive);
  const startCounter = useRitualStore((s) => s.startCounter);
  const incrementLap = useRitualStore((s) => s.incrementLap);
  const pauseCounter = useRitualStore((s) => s.pauseCounter);
  const resumeCounter = useRitualStore((s) => s.resumeCounter);
  const resetCounter = useRitualStore((s) => s.resetCounter);

  const isComplete = !!(counter && counter.completedLaps >= 7);
  const isPaused = counter?.isPaused ?? false;

  const handleStart = (ritual: RitualCounterType) => startCounter(ritual);

  const handleTap = () => {
    if (!counter || isPaused || isComplete) return;
    incrementLap(null as any, false);
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(t('tracker_ui.reset_confirm'))) resetCounter();
    } else {
      Alert.alert(t('common.confirm'), t('tracker_ui.reset_confirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('tracker_ui.reset'), style: 'destructive', onPress: resetCounter },
      ]);
    }
  };

  if (!counter) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.pickTitle}>🕋 {t('tabs.tracker')}</Text>
          <Text style={styles.pickSub}>{t('tracker_ui.pick_subtitle')}</Text>
          <View style={styles.pickRow}>
            <TouchableOpacity style={styles.pickCard} onPress={() => handleStart('tawaf')}>
              <Text style={styles.pickEmoji}>🕋</Text>
              <Text style={styles.pickLabel}>{t('tracker.tawaf')}</Text>
              <Text style={styles.pickHint}>{t('tracker_ui.tawaf_hint')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickCard} onPress={() => handleStart('sai')}>
              <Text style={styles.pickEmoji}>🏃</Text>
              <Text style={styles.pickLabel}>{t('tracker.sai')}</Text>
              <Text style={styles.pickHint}>{t('tracker_ui.sai_hint')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const ritualLabel = counter.ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.rowBetween}>
          <Text style={styles.ritualTitle}>{ritualLabel}</Text>
          {isComplete && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>✅ {t('tracker.complete')}</Text>
            </View>
          )}
        </View>

        <View style={styles.dotsRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <View key={n} style={[styles.dot, counter.completedLaps >= n && styles.dotDone, counter.currentLap === n && !isComplete && styles.dotCurrent]}>
              <Text style={[styles.dotText, counter.completedLaps >= n && styles.dotTextDone]}>
                {counter.completedLaps >= n ? '✓' : n}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.counterBox}>
          <Text style={styles.lapNumber}>{counter.completedLaps}</Text>
          <Text style={styles.lapOf}>{t('tracker.of')} 7 {t('tracker.round')}</Text>
        </View>

        {!isComplete && (
          <TouchableOpacity
            style={[styles.tapBtn, isPaused && styles.tapBtnPaused]}
            onPress={handleTap}
            activeOpacity={0.7}
            disabled={isPaused}
          >
            <Text style={styles.tapBtnText}>
              {isPaused ? `⏸ ${t('tracker.paused')}` : t('tracker.tap_to_count')}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.controlRow}>
          {!isComplete && (
            isPaused
              ? <TouchableOpacity style={styles.controlBtn} onPress={resumeCounter}>
                  <Text style={styles.controlBtnText}>▶ {t('common.resume')}</Text>
                </TouchableOpacity>
              : <TouchableOpacity style={[styles.controlBtn, styles.controlBtnGhost]} onPress={pauseCounter}>
                  <Text style={[styles.controlBtnText, { color: Colors.textPrimary }]}>⏸ {t('tracker_ui.pause')}</Text>
                </TouchableOpacity>
          )}
          {isComplete
            ? <TouchableOpacity style={styles.controlBtn} onPress={resetCounter}>
                <Text style={styles.controlBtnText}>{t('common.start_over')}</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={[styles.controlBtn, styles.controlBtnGhost, { borderColor: Colors.danger + '44' }]} onPress={handleReset}>
                <Text style={[styles.controlBtnText, { color: Colors.danger }]}>✕ {t('tracker_ui.reset')}</Text>
              </TouchableOpacity>
          }
        </View>

        {counter.lapHistory.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.historyTitle}>{t('tracker_ui.completed_laps')}</Text>
            {counter.lapHistory.map((lap) => (
              <View key={lap.lapNumber} style={styles.historyRow}>
                <Text style={styles.historyLap}>{t('tracker.round')} {lap.lapNumber}</Text>
                {lap.durationMs !== null && (
                  <Text style={styles.historyDur}>{Math.round(lap.durationMs / 1000 / 60)} min</Text>
                )}
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pickTitle: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  pickSub: { fontSize: 14, color: Colors.textPrimary, opacity: 0.55, marginBottom: 32 },
  pickRow: { flexDirection: 'row', gap: 16 },
  pickCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  pickEmoji: { fontSize: 36, marginBottom: 8 },
  pickLabel: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 4 },
  pickHint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, textAlign: 'center' },
  scroll: { padding: 20, paddingBottom: 48 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  ritualTitle: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen },
  completeBadge: { backgroundColor: Colors.success + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  completeBadgeText: { fontSize: 13, color: Colors.success, fontWeight: '600' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 },
  dot: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: Colors.brandGreen + '44', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  dotDone: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  dotCurrent: { borderColor: Colors.goldAccent, borderWidth: 2.5 },
  dotText: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen },
  dotTextDone: { color: Colors.white },
  counterBox: { alignItems: 'center', marginBottom: 28 },
  lapNumber: { fontSize: 96, fontWeight: '800', color: Colors.brandGreen, lineHeight: 104 },
  lapOf: { fontSize: 16, color: Colors.textPrimary, opacity: 0.45 },
  tapBtn: { backgroundColor: Colors.brandGreen, borderRadius: 20, paddingVertical: 28, alignItems: 'center', marginBottom: 16 },
  tapBtnPaused: { backgroundColor: Colors.textPrimary + '22' },
  tapBtnText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  controlRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  controlBtn: { flex: 1, backgroundColor: Colors.brandGreen, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  controlBtnGhost: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  controlBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  historyBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.brandGreen + '22' },
  historyTitle: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen, opacity: 0.55, marginBottom: 10, textTransform: 'uppercase' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  historyLap: { fontSize: 14, color: Colors.textPrimary },
  historyDur: { fontSize: 14, color: Colors.textPrimary, opacity: 0.45 },
});
