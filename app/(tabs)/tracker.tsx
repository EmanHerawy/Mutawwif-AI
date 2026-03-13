import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform, Switch, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useTranslation } from 'react-i18next';
import { useRitualStore } from '../../src/stores/ritualStore';
import { Colors } from '../../src/theme/colors';
import { AZKAR_DATABASE } from '../../src/data/azkar-database';
import type { RitualCounterType } from '../../src/types/ritual.types';

// --- Elapsed time hook ---
function useElapsedSeconds(enabled: boolean, lapKey: number): number {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
    if (!enabled) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, lapKey]);

  return elapsed;
}

function formatElapsed(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function TrackerScreen() {
  const { t } = useTranslation();
  const counter = useRitualStore((s) => s.counter);
  const isActive = useRitualStore((s) => s.isActive);
  const trackerPrefs = useRitualStore((s) => s.trackerPrefs);
  const currentLapSteps = useRitualStore((s) => s.currentLapSteps);
  const startCounter = useRitualStore((s) => s.startCounter);
  const incrementLap = useRitualStore((s) => s.incrementLap);
  const pauseCounter = useRitualStore((s) => s.pauseCounter);
  const resumeCounter = useRitualStore((s) => s.resumeCounter);
  const resetCounter = useRitualStore((s) => s.resetCounter);
  const updateTrackerPrefs = useRitualStore((s) => s.updateTrackerPrefs);
  const addSteps = useRitualStore((s) => s.addSteps);

  const [showSettings, setShowSettings] = useState(false);
  const lapKey = counter?.completedLaps ?? 0;
  const elapsed = useElapsedSeconds(
    !!(trackerPrefs.trackTime && counter && isActive && !counter.isPaused),
    lapKey,
  );

  const isComplete = !!(counter && counter.completedLaps >= 7);
  const isPaused = counter?.isPaused ?? false;

  // Pedometer subscription when trackSteps is on
  useEffect(() => {
    if (!trackerPrefs.trackSteps || !counter || !isActive || isComplete) return;

    let sub: { remove: () => void } | null = null;
    Pedometer.isAvailableAsync().then((available) => {
      if (!available) return;
      sub = Pedometer.watchStepCount((result) => {
        addSteps(result.steps);
      });
    });

    return () => sub?.remove();
  }, [trackerPrefs.trackSteps, lapKey, isActive, isComplete]);

  const handleStart = (ritual: RitualCounterType) => startCounter(ritual);

  const handleTap = () => {
    if (!counter || isPaused || isComplete) return;
    incrementLap(null, false, false);
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

        {/* Header row */}
        <View style={styles.rowBetween}>
          <Text style={styles.ritualTitle}>{ritualLabel}</Text>
          <View style={styles.headerRight}>
            {isComplete && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeBadgeText}>✅ {t('tracker.complete')}</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.gearBtn}>
              <FontAwesome5 name="cog" size={18} color={Colors.brandGreen} />
            </TouchableOpacity>
          </View>
        </View>

        {/* GPS auto-detect badge */}
        {trackerPrefs.autoDetectLaps && (
          <View style={styles.gpsBadge}>
            <FontAwesome5 name="satellite-dish" size={11} color={Colors.brandGreen} />
            <Text style={styles.gpsBadgeText}>{t('tracker_ui.auto_detect_active')}</Text>
          </View>
        )}

        {/* Lap dots */}
        <View style={styles.dotsRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <View key={n} style={[styles.dot, counter.completedLaps >= n && styles.dotDone, counter.currentLap === n && !isComplete && styles.dotCurrent]}>
              <Text style={[styles.dotText, counter.completedLaps >= n && styles.dotTextDone]}>
                {counter.completedLaps >= n ? '✓' : n}
              </Text>
            </View>
          ))}
        </View>

        {/* Counter box */}
        <View style={styles.counterBox}>
          <Text style={styles.lapNumber}>{counter.completedLaps}</Text>
          <Text style={styles.lapOf}>{t('tracker.of')} 7 {t('tracker.round')}</Text>

          {/* Live stats row */}
          {(trackerPrefs.trackTime || trackerPrefs.trackSteps) && !isComplete && (
            <View style={styles.statsRow}>
              {trackerPrefs.trackTime && (
                <View style={styles.statChip}>
                  <FontAwesome5 name="clock" size={10} color={Colors.brandGreen} />
                  <Text style={styles.statText}>{formatElapsed(elapsed)}</Text>
                </View>
              )}
              {trackerPrefs.trackSteps && (
                <View style={styles.statChip}>
                  <FontAwesome5 name="shoe-prints" size={10} color={Colors.brandGreen} />
                  <Text style={styles.statText}>{currentLapSteps} {t('tracker_ui.steps')}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Tap button */}
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

        {/* Control row */}
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

        {/* Per-lap du'a card */}
        {!isComplete && (
          <LapAzkarCard ritual={counter.ritual} lapNumber={counter.currentLap} />
        )}

        {/* Lap history */}
        {counter.lapHistory.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.historyTitle}>{t('tracker_ui.completed_laps')}</Text>
            {counter.lapHistory.map((lap) => (
              <View key={lap.lapNumber} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyLap}>{t('tracker.round')} {lap.lapNumber}</Text>
                  {lap.autoDetected && (
                    <View style={styles.autoTag}>
                      <Text style={styles.autoTagText}>GPS</Text>
                    </View>
                  )}
                </View>
                <View style={styles.historyRight}>
                  {lap.steps !== undefined && (
                    <Text style={styles.historyMeta}>{lap.steps} {t('tracker_ui.steps')}</Text>
                  )}
                  {lap.durationMs !== null && (
                    <Text style={styles.historyDur}>{Math.round(lap.durationMs / 1000 / 60)} min</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Settings drawer modal */}
      <SettingsModal
        visible={showSettings}
        autoDetect={trackerPrefs.autoDetectLaps}
        trackSteps={trackerPrefs.trackSteps}
        trackTime={trackerPrefs.trackTime}
        onClose={() => setShowSettings(false)}
        onToggleAutoDetect={(v) => updateTrackerPrefs({ autoDetectLaps: v })}
        onToggleSteps={(v) => updateTrackerPrefs({ trackSteps: v })}
        onToggleTime={(v) => updateTrackerPrefs({ trackTime: v })}
      />
    </SafeAreaView>
  );
}

// --- Per-lap Du'a Card ---
const RITUAL_AZKAR_CATEGORY: Record<RitualCounterType, string> = {
  tawaf: 'tawaf_general',
  sai: 'sai',
};

function LapAzkarCard({ ritual, lapNumber }: { ritual: RitualCounterType; lapNumber: number }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const category = RITUAL_AZKAR_CATEGORY[ritual];
  const items = AZKAR_DATABASE.filter(
    (z) => z.category === category && (z.lapNumber === null || z.lapNumber === lapNumber),
  );

  if (items.length === 0) return null;

  return (
    <View style={azkarStyles.card}>
      <TouchableOpacity style={azkarStyles.header} onPress={() => setOpen((v) => !v)} activeOpacity={0.8}>
        <View style={azkarStyles.headerLeft}>
          <FontAwesome5 name="book-open" size={13} color={Colors.brandGreen} />
          <Text style={azkarStyles.headerTitle}>
            {isAr ? 'أذكار هذا الشوط' : "This Lap's Du'a"}
          </Text>
          <View style={azkarStyles.countBadge}>
            <Text style={azkarStyles.countText}>{items.length}</Text>
          </View>
        </View>
        <FontAwesome5 name={open ? 'chevron-up' : 'chevron-down'} size={11} color={Colors.brandGreen} />
      </TouchableOpacity>

      {open && (
        <View style={azkarStyles.list}>
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[azkarStyles.item, idx < items.length - 1 && azkarStyles.itemBorder]}
                onPress={() => setExpandedId(isExpanded ? null : item.id)}
                activeOpacity={0.8}
              >
                <View style={azkarStyles.itemRow}>
                  <Text style={azkarStyles.arabic} numberOfLines={isExpanded ? undefined : 2}>
                    {item.arabicText}
                  </Text>
                  {item.repeatCount > 1 && (
                    <View style={azkarStyles.repeatBadge}>
                      <Text style={azkarStyles.repeatText}>×{item.repeatCount}</Text>
                    </View>
                  )}
                </View>
                {isExpanded && (
                  <View style={azkarStyles.expanded}>
                    {!!item.transliteration && (
                      <Text style={azkarStyles.transliteration}>{item.transliteration}</Text>
                    )}
                    <Text style={azkarStyles.translation}>{item.translationEn}</Text>
                    {!!item.source && <Text style={azkarStyles.source}>{item.source}</Text>}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

// --- Settings Modal ---
interface SettingsProps {
  visible: boolean;
  autoDetect: boolean;
  trackSteps: boolean;
  trackTime: boolean;
  onClose: () => void;
  onToggleAutoDetect: (v: boolean) => void;
  onToggleSteps: (v: boolean) => void;
  onToggleTime: (v: boolean) => void;
}

function SettingsModal({ visible, autoDetect, trackSteps, trackTime, onClose, onToggleAutoDetect, onToggleSteps, onToggleTime }: SettingsProps) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={settStyles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={settStyles.sheet}>
        <View style={settStyles.handle} />
        <Text style={settStyles.title}>{t('tracker_ui.settings_title')}</Text>

        <SettingRow
          label={t('tracker_ui.auto_detect_label')}
          hint={t('tracker_ui.auto_detect_hint')}
          value={autoDetect}
          onToggle={onToggleAutoDetect}
        />
        <SettingRow
          label={t('tracker_ui.track_steps_label')}
          hint={t('tracker_ui.track_steps_hint')}
          value={trackSteps}
          onToggle={onToggleSteps}
        />
        <SettingRow
          label={t('tracker_ui.track_time_label')}
          hint={t('tracker_ui.track_time_hint')}
          value={trackTime}
          onToggle={onToggleTime}
        />

        <TouchableOpacity style={settStyles.doneBtn} onPress={onClose}>
          <Text style={settStyles.doneBtnText}>{t('common.done')}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function SettingRow({ label, hint, value, onToggle }: { label: string; hint: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={settStyles.row}>
      <View style={settStyles.rowText}>
        <Text style={settStyles.rowLabel}>{label}</Text>
        <Text style={settStyles.rowHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.brandGreen + '33', true: Colors.brandGreen }}
        thumbColor={Colors.white}
      />
    </View>
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
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ritualTitle: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  completeBadge: { backgroundColor: Colors.success + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  completeBadgeText: { fontSize: 13, color: Colors.success, fontWeight: '600' },
  gearBtn: { padding: 6 },
  gpsBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.brandGreen + '15', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 12 },
  gpsBadgeText: { fontSize: 11, color: Colors.brandGreen, fontWeight: '600' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 },
  dot: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: Colors.brandGreen + '44', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  dotDone: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  dotCurrent: { borderColor: Colors.goldAccent, borderWidth: 2.5 },
  dotText: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen },
  dotTextDone: { color: Colors.white },
  counterBox: { alignItems: 'center', marginBottom: 28 },
  lapNumber: { fontSize: 96, fontWeight: '800', color: Colors.brandGreen, lineHeight: 104 },
  lapOf: { fontSize: 16, color: Colors.textPrimary, opacity: 0.45 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.brandGreen + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statText: { fontSize: 12, fontWeight: '600', color: Colors.brandGreen },
  tapBtn: { backgroundColor: Colors.brandGreen, borderRadius: 20, paddingVertical: 28, alignItems: 'center', marginBottom: 16 },
  tapBtnPaused: { backgroundColor: Colors.textPrimary + '22' },
  tapBtnText: { fontSize: 20, fontWeight: '700', color: Colors.white },
  controlRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  controlBtn: { flex: 1, backgroundColor: Colors.brandGreen, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  controlBtnGhost: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  controlBtnText: { fontSize: 14, fontWeight: '600', color: Colors.white },
  historyBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.brandGreen + '22' },
  historyTitle: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen, opacity: 0.55, marginBottom: 10, textTransform: 'uppercase' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  historyLap: { fontSize: 14, color: Colors.textPrimary },
  autoTag: { backgroundColor: Colors.brandGreen + '22', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  autoTagText: { fontSize: 9, fontWeight: '700', color: Colors.brandGreen },
  historyRight: { alignItems: 'flex-end', gap: 2 },
  historyMeta: { fontSize: 12, color: Colors.textPrimary, opacity: 0.55 },
  historyDur: { fontSize: 14, color: Colors.textPrimary, opacity: 0.45 },
});

const azkarStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '22',
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen },
  countBadge: {
    backgroundColor: Colors.brandGreen + '18',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countText: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen },
  list: { borderTopWidth: 1, borderTopColor: Colors.brandGreen + '15' },
  item: { paddingHorizontal: 16, paddingVertical: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  arabic: {
    flex: 1,
    fontSize: 18,
    color: Colors.brandGreen,
    fontWeight: '700',
    textAlign: 'right',
    lineHeight: 32,
  },
  repeatBadge: {
    backgroundColor: Colors.goldAccent + '22',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 4,
  },
  repeatText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '700' },
  expanded: { marginTop: 10 },
  transliteration: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.5,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  translation: { fontSize: 13, color: Colors.textPrimary, lineHeight: 20, marginBottom: 4 },
  source: { fontSize: 10, color: Colors.textPrimary, opacity: 0.35, marginTop: 2 },
});

const settStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  handle: { width: 36, height: 4, backgroundColor: Colors.brandGreen + '33', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.brandGreen, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  rowText: { flex: 1, paddingRight: 16 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  rowHint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, marginTop: 2 },
  doneBtn: { marginTop: 24, backgroundColor: Colors.brandGreen, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
