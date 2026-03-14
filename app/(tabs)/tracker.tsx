import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert, Platform, Switch, Modal,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useTranslation } from 'react-i18next';
import { useRitualStore } from '../../src/stores/ritualStore';
import { Colors } from '../../src/theme/colors';
import { AZKAR_DATABASE } from '../../src/data/azkar-database';
import type { RitualCounterType } from '../../src/types/ritual.types';

// ─── Types ────────────────────────────────────────────────────────────────────

type CrowdLevel = 'light' | 'moderate' | 'heavy' | 'extreme';
type Phase = 0 | 1 | 2; // 0=pick ritual, 1=pick floor, 2=counter

const CROWD_META: Record<CrowdLevel, { labelAr: string; labelEn: string; color: string }> = {
  light:    { labelAr: 'خفيفة',      labelEn: 'Light',    color: '#22C55E' },
  moderate: { labelAr: 'معتدلة',     labelEn: 'Moderate', color: '#F59E0B' },
  heavy:    { labelAr: 'كثيفة',      labelEn: 'Heavy',    color: '#EF4444' },
  extreme:  { labelAr: 'شديدة جداً', labelEn: 'Extreme',  color: '#7C3AED' },
};
const CROWD_LEVELS: CrowdLevel[] = ['light', 'moderate', 'heavy', 'extreme'];

// Estimated minutes per lap (range)
const LAP_TIME_EST: Record<'tawaf' | 'sai', Record<CrowdLevel, { min: number; max: number }>> = {
  tawaf: { light: { min: 15, max: 20 }, moderate: { min: 25, max: 35 }, heavy: { min: 40, max: 55 }, extreme: { min: 60, max: 90 } },
  sai:   { light: { min: 20, max: 25 }, moderate: { min: 25, max: 35 }, heavy: { min: 35, max: 45 }, extreme: { min: 45, max: 60 } },
};

interface FloorOption {
  id: string;
  nameAr: string;
  nameEn: string;
  notesAr: string;
  notesEn: string;
  accessible: boolean;
  defaultCrowd: CrowdLevel;
  icon: string;
}

const TAWAF_FLOORS: FloorOption[] = [
  {
    id: 'ground', nameAr: 'الدور الأرضي (المطاف)', nameEn: 'Ground Floor (Mataf)',
    notesAr: 'الأقرب للكعبة — مكشوف — مسار مخصص للعربات — الأشد كثافة',
    notesEn: 'Closest to Kaaba — open-air — dedicated wheelchair lane — most crowded',
    accessible: true, defaultCrowd: 'heavy', icon: 'kaaba',
  },
  {
    id: 'floor_1', nameAr: 'الطابق الأول', nameEn: '1st Floor',
    notesAr: 'مسقّف — مسارات أوسع للعربات — أقل ازدحاماً — المسافة ~٢ كم',
    notesEn: 'Covered — wider wheelchair lanes — less crowded — ~2km per lap',
    accessible: true, defaultCrowd: 'moderate', icon: 'layer-group',
  },
  {
    id: 'floor_2', nameAr: 'الطابق الثاني', nameEn: '2nd Floor',
    notesAr: 'مسقّف — أقل ازدحاماً — مناسب للنساء',
    notesEn: 'Covered — less crowded — good for women',
    accessible: false, defaultCrowd: 'light', icon: 'layer-group',
  },
  {
    id: 'roof', nameAr: 'السطح (الدور الثالث)', nameEn: 'Roof (3rd Floor)',
    notesAr: 'مكشوف — مسارات للعربات اليدوية والكهربائية — خيار ممتاز وقت الذروة',
    notesEn: 'Open-air — manual & electric wheelchair lanes — excellent during peak',
    accessible: true, defaultCrowd: 'light', icon: 'mountain',
  },
];

const SAI_FLOORS: FloorOption[] = [
  {
    id: 'ground', nameAr: 'الدور الأرضي', nameEn: 'Ground Floor',
    notesAr: 'عربات يدوية وكهربائية — مسار مخصص — منطقة الهرولة (رجال) — الأكثر ازدحاماً',
    notesEn: 'Manual & electric carts — dedicated lane — jogging zone (men) — most crowded',
    accessible: true, defaultCrowd: 'heavy', icon: 'running',
  },
  {
    id: 'floor_1', nameAr: 'الطابق الأول (الميزانين)', nameEn: '1st Floor (Mezzanine)',
    notesAr: 'عربات يدوية وكهربائية — نقاط استلام وتسليم — مسارات مخصصة — ازدحام معتدل',
    notesEn: 'Manual & electric carts — pickup/return points — dedicated lanes — moderate crowd',
    accessible: true, defaultCrowd: 'moderate', icon: 'layer-group',
  },
  {
    id: 'floor_2', nameAr: 'الطابق الثاني', nameEn: '2nd Floor',
    notesAr: 'عربات كهربائية — مسارات مخصصة — أقل ازدحاماً',
    notesEn: 'Electric carts — dedicated lanes — less crowded',
    accessible: true, defaultCrowd: 'light', icon: 'layer-group',
  },
  {
    id: 'floor_3', nameAr: 'الطابق الثالث', nameEn: '3rd Floor',
    notesAr: 'عربات جولف — الأقل ازدحاماً — الأبعد عن منصتي الصفا والمروة',
    notesEn: 'Golf carts — least crowded — farthest from Safa/Marwa platforms',
    accessible: true, defaultCrowd: 'light', icon: 'layer-group',
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

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

/** Format seconds to mm:ss */
function fmtSec(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Format milliseconds to mm:ss */
function fmtMs(ms: number | null | undefined): string {
  if (!ms) return '—';
  return fmtSec(Math.floor(ms / 1000));
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TrackerScreen() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

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

  // Phase state
  const [phase, setPhase] = useState<Phase>(counter ? 2 : 0);
  const [pendingRitual, setPendingRitual] = useState<RitualCounterType | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<FloorOption | null>(null);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('moderate');
  const [showSettings, setShowSettings] = useState(false);

  const lapKey = counter?.completedLaps ?? 0;
  const elapsed = useElapsedSeconds(
    !!(trackerPrefs.trackTime && counter && isActive && !counter.isPaused),
    lapKey,
  );
  const isComplete = !!(counter && counter.completedLaps >= 7);
  const isPaused = counter?.isPaused ?? false;

  // Sync phase when counter appears/disappears
  useEffect(() => {
    if (counter && phase !== 2) setPhase(2);
    if (!counter && phase === 2) setPhase(0);
  }, [!!counter]);

  // Pedometer
  useEffect(() => {
    if (!trackerPrefs.trackSteps || !counter || !isActive || isComplete) return;
    let sub: { remove: () => void } | null = null;
    Pedometer.isAvailableAsync().then((available) => {
      if (!available) return;
      sub = Pedometer.watchStepCount((result) => addSteps(result.steps));
    });
    return () => sub?.remove();
  }, [trackerPrefs.trackSteps, lapKey, isActive, isComplete]);

  const handlePickRitual = (ritual: RitualCounterType) => {
    setPendingRitual(ritual);
    const firstFloor = ritual === 'tawaf' ? TAWAF_FLOORS[0] : SAI_FLOORS[0];
    setSelectedFloor(firstFloor);
    setCrowdLevel(firstFloor.defaultCrowd);
    setPhase(1);
  };

  const handleStartCounter = () => {
    if (!pendingRitual) return;
    startCounter(pendingRitual);
    setPhase(2);
  };

  const handleTap = () => {
    if (!counter || isPaused || isComplete) return;
    incrementLap(null, false, false);
  };

  const handleReset = () => {
    const doReset = () => { resetCounter(); setPhase(0); setSelectedFloor(null); };
    if (Platform.OS === 'web') {
      if (window.confirm(t('tracker_ui.reset_confirm'))) doReset();
    } else {
      Alert.alert(t('common.confirm'), t('tracker_ui.reset_confirm'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('tracker_ui.reset'), style: 'destructive', onPress: doReset },
      ]);
    }
  };

  // ── Phase 0: Pick ritual ──────────────────────────────────────────────────

  if (phase === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.pickTitle}>🕋 {t('tabs.tracker')}</Text>
          <Text style={styles.pickSub}>{t('tracker_ui.pick_subtitle')}</Text>
          <View style={styles.pickRow}>
            <TouchableOpacity style={styles.pickCard} onPress={() => handlePickRitual('tawaf')}>
              <Text style={styles.pickEmoji}>🕋</Text>
              <Text style={styles.pickLabel}>{t('tracker.tawaf')}</Text>
              <Text style={styles.pickHint}>{t('tracker_ui.tawaf_hint')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickCard} onPress={() => handlePickRitual('sai')}>
              <Text style={styles.pickEmoji}>🏃</Text>
              <Text style={styles.pickLabel}>{t('tracker.sai')}</Text>
              <Text style={styles.pickHint}>{t('tracker_ui.sai_hint')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Phase 1: Floor + crowd selection ─────────────────────────────────────

  if (phase === 1 && pendingRitual) {
    const floors = pendingRitual === 'tawaf' ? TAWAF_FLOORS : SAI_FLOORS;
    const est = LAP_TIME_EST[pendingRitual][crowdLevel];
    const ritualLabel = pendingRitual === 'tawaf'
      ? (isAr ? 'الطواف' : 'Tawaf')
      : (isAr ? 'السعي' : "Sa'i");

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.floorScroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.floorHeader}>
            <TouchableOpacity onPress={() => setPhase(0)} style={styles.backBtn}>
              <FontAwesome5 name="arrow-left" size={14} color={Colors.brandGreen} />
            </TouchableOpacity>
            <Text style={styles.floorTitle}>
              {isAr ? `${ritualLabel} — اختر الطابق` : `${ritualLabel} — Choose Floor`}
            </Text>
          </View>

          <Text style={styles.floorIntro}>
            {isAr
              ? 'حدد الطابق الذي ستؤدي فيه الشعيرة وكثافة الحشد الحالية'
              : 'Select the floor you will use and the current crowd level'}
          </Text>

          {/* Floor cards */}
          {floors.map((floor) => {
            const isSelected = selectedFloor?.id === floor.id;
            return (
              <TouchableOpacity
                key={floor.id}
                style={[styles.floorCard, isSelected && styles.floorCardSelected]}
                onPress={() => {
                  setSelectedFloor(floor);
                  setCrowdLevel(floor.defaultCrowd);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.floorCardLeft}>
                  <View style={[styles.floorIconBox, isSelected && { backgroundColor: Colors.brandGreen + '20' }]}>
                    <FontAwesome5 name={floor.icon as any} size={18} color={isSelected ? Colors.brandGreen : Colors.textPrimary} style={{ opacity: isSelected ? 1 : 0.4 }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.floorName, isSelected && { color: Colors.brandGreen }]}>
                      {isAr ? floor.nameAr : floor.nameEn}
                    </Text>
                    <Text style={styles.floorNotes}>
                      {isAr ? floor.notesAr : floor.notesEn}
                    </Text>
                  </View>
                </View>
                <View style={styles.floorCardRight}>
                  {floor.accessible && (
                    <FontAwesome5 name="wheelchair" size={13} color={Colors.brandGreen} />
                  )}
                  {isSelected && (
                    <FontAwesome5 name="check-circle" size={18} color={Colors.brandGreen} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Crowd level */}
          <View style={styles.crowdSection}>
            <Text style={styles.crowdSectionTitle}>
              {isAr ? 'كثافة الحشد الحالية في الطابق المختار' : 'Current crowd level on selected floor'}
            </Text>
            <View style={styles.crowdBtnRow}>
              {CROWD_LEVELS.map((l) => {
                const m = CROWD_META[l];
                return (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.crowdBtn,
                      { borderColor: m.color + '44' },
                      l === crowdLevel && { backgroundColor: m.color, borderColor: m.color },
                    ]}
                    onPress={() => setCrowdLevel(l)}
                  >
                    <Text style={[styles.crowdBtnText, l === crowdLevel && { color: '#fff' }]}>
                      {isAr ? m.labelAr : m.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Estimated time */}
          <View style={[styles.estBox, { borderColor: CROWD_META[crowdLevel].color + '44' }]}>
            <FontAwesome5 name="clock" size={14} color={CROWD_META[crowdLevel].color} />
            <View>
              <Text style={[styles.estLabel, { color: CROWD_META[crowdLevel].color }]}>
                {isAr ? 'الوقت المتوقع لكل شوط' : 'Estimated time per lap'}
              </Text>
              <Text style={styles.estValue}>
                {est.min}–{est.max} {isAr ? 'دقيقة' : 'min'}
              </Text>
              <Text style={styles.estTotal}>
                {isAr
                  ? `إجمالي 7 أشواط: ${est.min * 7}–${est.max * 7} دقيقة`
                  : `Full 7 laps: ${est.min * 7}–${est.max * 7} min`}
              </Text>
            </View>
          </View>

          {/* Wheelchair / Cart info */}
          {(pendingRitual === 'tawaf' || pendingRitual === 'sai') && (
            <View style={styles.cartInfoBox}>
              <View style={styles.cartInfoHeader}>
                <FontAwesome5 name="wheelchair" size={13} color={Colors.brandGreen} />
                <Text style={styles.cartInfoTitle}>
                  {pendingRitual === 'tawaf'
                    ? (isAr ? 'الطواف بالكرسي المتحرك أو العربة' : 'Tawaf by Wheelchair / Cart')
                    : (isAr ? 'السعي بالكرسي المتحرك أو العربة' : "Sa'i by Wheelchair / Cart")}
                </Text>
              </View>
              <Text style={styles.cartInfoRule}>
                {isAr
                  ? '✅ الحكم الشرعي: جائز عند العذر (كبار السن، العجز، التعب الشديد)'
                  : '✅ Islamic ruling: Permitted when there is a valid excuse (elderly, disability, extreme fatigue)'}
              </Text>
              <View style={styles.cartInfoDivider} />
              <Text style={styles.cartInfoItem}>
                {isAr
                  ? '🛒 الأنواع: يدوية مجانية (دفع) — كهربائية مدفوعة — عربات جولف (الطابق الثالث للسعي)'
                  : '🛒 Types: Manual free (push) — electric paid — golf carts (Sa\'i 3rd floor)'}
              </Text>
              <Text style={styles.cartInfoItem}>
                {isAr
                  ? '📍 الحجز: داخل الحرم أو عبر تطبيق «تنمية»'
                  : '📍 Rental: Available inside the Haram or via the "Tanmiya" app'}
              </Text>
              {pendingRitual === 'tawaf' && (
                <Text style={styles.cartInfoItem}>
                  {isAr
                    ? '🚏 نقاط الاستلام: باب الملك عبد العزيز — باب العمرة — باب الفتح'
                    : '🚏 Pickup points: King Abdulaziz Gate — Umrah Gate — Fath Gate'}
                </Text>
              )}
              {pendingRitual === 'sai' && (
                <Text style={styles.cartInfoItem}>
                  {isAr
                    ? '🚏 نقاط الاستلام: الدور الأرضي (باب ١٤) — الطابق الأول — الطابق الثاني — الطابق الثالث (باب السلام، باب ٦٤)'
                    : '🚏 Pickup points: Ground (Gate 14) — 1st floor — 2nd floor — 3rd floor (Salam Gate, Gate 64)'}
                </Text>
              )}
              <Text style={styles.cartInfoItem}>
                {isAr
                  ? '⚠️ الزم مسار العربات المخصص — تجنب الاصطدام بالمشاة'
                  : '⚠️ Stay in the designated cart lane — avoid collisions with pedestrians'}
              </Text>
            </View>
          )}

          {/* Start button */}
          <TouchableOpacity style={styles.startBtn} onPress={handleStartCounter}>
            <FontAwesome5 name="play" size={14} color={Colors.white} />
            <Text style={styles.startBtnText}>
              {isAr ? 'ابدأ العداد' : 'Start Counter'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Phase 2: Active counter ───────────────────────────────────────────────

  if (!counter) return null;

  const ritualLabel = counter.ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai');
  const estPerLap = LAP_TIME_EST[counter.ritual][crowdLevel];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.ritualTitle}>{ritualLabel}</Text>
            {selectedFloor && (
              <View style={styles.floorBadge}>
                <FontAwesome5 name="layer-group" size={10} color={Colors.brandGreen} />
                <Text style={styles.floorBadgeText}>
                  {isAr ? selectedFloor.nameAr : selectedFloor.nameEn}
                </Text>
              </View>
            )}
          </View>
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

        {/* GPS badge */}
        {trackerPrefs.autoDetectLaps && (
          <View style={styles.gpsBadge}>
            <FontAwesome5 name="satellite-dish" size={11} color={Colors.brandGreen} />
            <Text style={styles.gpsBadgeText}>{t('tracker_ui.auto_detect_active')}</Text>
          </View>
        )}

        {/* Crowd + expected time strip */}
        {!isComplete && (
          <View style={styles.crowdStrip}>
            <View style={styles.crowdStripLeft}>
              <View style={[styles.crowdDot, { backgroundColor: CROWD_META[crowdLevel].color }]} />
              <Text style={[styles.crowdStripLabel, { color: CROWD_META[crowdLevel].color }]}>
                {isAr ? CROWD_META[crowdLevel].labelAr : CROWD_META[crowdLevel].labelEn}
              </Text>
            </View>
            <Text style={styles.crowdStripEst}>
              {isAr
                ? `الشوط المتوقع: ${estPerLap.min}–${estPerLap.max} د`
                : `~${estPerLap.min}–${estPerLap.max} min/lap`}
            </Text>
            <View style={styles.crowdChangeBtns}>
              {CROWD_LEVELS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[
                    styles.crowdMiniBtn,
                    { borderColor: CROWD_META[l].color + '50' },
                    l === crowdLevel && { backgroundColor: CROWD_META[l].color },
                  ]}
                  onPress={() => setCrowdLevel(l)}
                >
                  <View style={[styles.crowdMiniDot, { backgroundColor: l === crowdLevel ? '#fff' : CROWD_META[l].color }]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Lap dots */}
        <View style={styles.dotsRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <View
              key={n}
              style={[
                styles.dot,
                counter.completedLaps >= n && styles.dotDone,
                counter.currentLap === n && !isComplete && styles.dotCurrent,
              ]}
            >
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

          {(trackerPrefs.trackTime || trackerPrefs.trackSteps) && !isComplete && (
            <View style={styles.statsRow}>
              {trackerPrefs.trackTime && (
                <View style={styles.statChip}>
                  <FontAwesome5 name="clock" size={10} color={Colors.brandGreen} />
                  <Text style={styles.statText}>{fmtSec(elapsed)}</Text>
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
            ? <TouchableOpacity style={styles.controlBtn} onPress={handleReset}>
                <Text style={styles.controlBtnText}>{t('common.start_over')}</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={[styles.controlBtn, styles.controlBtnGhost, { borderColor: Colors.danger + '44' }]} onPress={handleReset}>
                <Text style={[styles.controlBtnText, { color: Colors.danger }]}>✕ {t('tracker_ui.reset')}</Text>
              </TouchableOpacity>
          }
        </View>

        {/* Per-lap du'a */}
        {!isComplete && (
          <LapAzkarCard ritual={counter.ritual} lapNumber={counter.currentLap} isAr={isAr} />
        )}

        {/* Lap history with expected vs actual */}
        {counter.lapHistory.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.historyTitle}>{t('tracker_ui.completed_laps')}</Text>
            {/* Column headers */}
            <View style={[styles.historyRow, { borderBottomColor: Colors.brandGreen + '22' }]}>
              <Text style={styles.historyHeaderLeft}>{isAr ? 'الشوط' : 'Lap'}</Text>
              <View style={styles.historyRight}>
                <Text style={styles.historyHeader}>{isAr ? 'الفعلي' : 'Actual'}</Text>
                <Text style={styles.historyHeader}>{isAr ? 'المتوقع' : 'Est.'}</Text>
                <Text style={styles.historyHeader}>{isAr ? 'الفرق' : 'Δ'}</Text>
              </View>
            </View>

            {counter.lapHistory.map((lap) => {
              const actualSec = lap.durationMs != null ? Math.floor(lap.durationMs / 1000) : null;
              const estMidSec = ((estPerLap.min + estPerLap.max) / 2) * 60;
              const deltaSec = actualSec != null ? actualSec - estMidSec : null;
              const deltaColor = deltaSec == null ? Colors.textPrimary
                : deltaSec > 120 ? '#EF4444'  // more than 2 min over
                : deltaSec < -120 ? '#22C55E' // more than 2 min under
                : Colors.textPrimary;

              return (
                <View key={lap.lapNumber} style={styles.historyRow}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyLap}>{t('tracker.round')} {lap.lapNumber}</Text>
                    {lap.autoDetected && (
                      <View style={styles.autoTag}>
                        <Text style={styles.autoTagText}>GPS</Text>
                      </View>
                    )}
                    {trackerPrefs.trackSteps && lap.steps !== undefined && (
                      <Text style={styles.historyMeta}>{lap.steps} {t('tracker_ui.steps')}</Text>
                    )}
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={[styles.historyDur, { minWidth: 40, textAlign: 'right' }]}>
                      {fmtMs(lap.durationMs)}
                    </Text>
                    <Text style={[styles.historyDur, { minWidth: 40, textAlign: 'right', opacity: 0.45 }]}>
                      {fmtSec(Math.round(estMidSec))}
                    </Text>
                    {deltaSec != null ? (
                      <Text style={[styles.historyDur, { minWidth: 44, textAlign: 'right', color: deltaColor, fontWeight: '700' }]}>
                        {deltaSec >= 0 ? '+' : ''}{fmtSec(Math.abs(deltaSec))}
                      </Text>
                    ) : (
                      <Text style={[styles.historyDur, { minWidth: 44, textAlign: 'right', opacity: 0.3 }]}>—</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>

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

// ─── Sub-components ───────────────────────────────────────────────────────────

const RITUAL_AZKAR_CATEGORY: Record<RitualCounterType, string> = {
  tawaf: 'tawaf_general',
  sai: 'sai',
};

function LapAzkarCard({ ritual, lapNumber, isAr }: { ritual: RitualCounterType; lapNumber: number; isAr: boolean }) {
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

interface SettingsProps {
  visible: boolean; autoDetect: boolean; trackSteps: boolean; trackTime: boolean;
  onClose: () => void; onToggleAutoDetect: (v: boolean) => void;
  onToggleSteps: (v: boolean) => void; onToggleTime: (v: boolean) => void;
}
function SettingsModal({ visible, autoDetect, trackSteps, trackTime, onClose, onToggleAutoDetect, onToggleSteps, onToggleTime }: SettingsProps) {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={settStyles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={settStyles.sheet}>
        <View style={settStyles.handle} />
        <Text style={settStyles.title}>{t('tracker_ui.settings_title')}</Text>
        <SettingRow label={t('tracker_ui.auto_detect_label')} hint={t('tracker_ui.auto_detect_hint')} value={autoDetect} onToggle={onToggleAutoDetect} />
        <SettingRow label={t('tracker_ui.track_steps_label')} hint={t('tracker_ui.track_steps_hint')} value={trackSteps} onToggle={onToggleSteps} />
        <SettingRow label={t('tracker_ui.track_time_label')} hint={t('tracker_ui.track_time_hint')} value={trackTime} onToggle={onToggleTime} />
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
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: Colors.brandGreen + '33', true: Colors.brandGreen }} thumbColor={Colors.white} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },

  // Phase 0
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  pickTitle: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, marginBottom: 6 },
  pickSub: { fontSize: 14, color: Colors.textPrimary, opacity: 0.55, marginBottom: 32 },
  pickRow: { flexDirection: 'row', gap: 16 },
  pickCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  pickEmoji: { fontSize: 36, marginBottom: 8 },
  pickLabel: { fontSize: 15, fontWeight: '700', color: Colors.brandGreen, marginBottom: 4 },
  pickHint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, textAlign: 'center' },

  // Phase 1 — floor select
  floorScroll: { padding: 20, paddingBottom: 48 },
  floorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brandGreen + '14', alignItems: 'center', justifyContent: 'center' },
  floorTitle: { fontSize: 18, fontWeight: '700', color: Colors.brandGreen, flex: 1 },
  floorIntro: { fontSize: 13, color: Colors.textPrimary, opacity: 0.55, marginBottom: 16, lineHeight: 20 },
  floorCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 1.5, borderColor: Colors.brandGreen + '18',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  floorCardSelected: { borderColor: Colors.brandGreen, backgroundColor: Colors.brandGreen + '05' },
  floorCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  floorIconBox: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.parchmentBg, alignItems: 'center', justifyContent: 'center' },
  floorName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  floorNotes: { fontSize: 11, color: Colors.textPrimary, opacity: 0.55, lineHeight: 16, flexShrink: 1 },
  floorCardRight: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8 },
  crowdSection: { marginTop: 16, marginBottom: 12 },
  crowdSectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 10, opacity: 0.7 },
  crowdBtnRow: { flexDirection: 'row', gap: 8 },
  crowdBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, backgroundColor: Colors.white, alignItems: 'center' },
  crowdBtnText: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, opacity: 0.65 },
  estBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: Colors.white, borderRadius: 12, padding: 14,
    borderWidth: 1.5, marginBottom: 20,
  },
  estLabel: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  estValue: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  estTotal: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, marginTop: 2 },
  cartInfoBox: {
    backgroundColor: Colors.brandGreen + '08',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '22',
    gap: 6,
  },
  cartInfoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cartInfoTitle: { fontSize: 13, fontWeight: '800', color: Colors.brandGreen },
  cartInfoRule: {
    fontSize: 12, fontWeight: '700', color: Colors.brandGreen,
    backgroundColor: Colors.brandGreen + '12', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, lineHeight: 18,
  },
  cartInfoDivider: { height: 1, backgroundColor: Colors.brandGreen + '15', marginVertical: 2 },
  cartInfoItem: { fontSize: 11.5, color: Colors.textPrimary, lineHeight: 18, opacity: 0.8 },
  startBtn: {
    backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  startBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },

  // Phase 2 — counter
  scroll: { padding: 20, paddingBottom: 48 },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  ritualTitle: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen },
  floorBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.brandGreen + '12', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  floorBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.brandGreen },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4 },
  completeBadge: { backgroundColor: Colors.brandGreen + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  completeBadgeText: { fontSize: 13, color: Colors.brandGreen, fontWeight: '600' },
  gearBtn: { padding: 6 },
  gpsBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.brandGreen + '15', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 10 },
  gpsBadgeText: { fontSize: 11, color: Colors.brandGreen, fontWeight: '600' },

  crowdStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 10, padding: 10,
    marginBottom: 14, gap: 8, borderWidth: 1, borderColor: Colors.brandGreen + '15',
  },
  crowdStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  crowdDot: { width: 8, height: 8, borderRadius: 4 },
  crowdStripLabel: { fontSize: 12, fontWeight: '700' },
  crowdStripEst: { flex: 1, fontSize: 11, color: Colors.textPrimary, opacity: 0.55 },
  crowdChangeBtns: { flexDirection: 'row', gap: 4 },
  crowdMiniBtn: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  crowdMiniDot: { width: 8, height: 8, borderRadius: 4 },

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
  historyTitle: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen, opacity: 0.55, marginBottom: 6, textTransform: 'uppercase' },
  historyHeaderLeft: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary, opacity: 0.4 },
  historyHeader: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary, opacity: 0.4, minWidth: 40, textAlign: 'right' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  historyLap: { fontSize: 14, color: Colors.textPrimary },
  autoTag: { backgroundColor: Colors.brandGreen + '22', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  autoTagText: { fontSize: 9, fontWeight: '700', color: Colors.brandGreen },
  historyRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  historyMeta: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5 },
  historyDur: { fontSize: 13, color: Colors.textPrimary },
});

const azkarStyles = StyleSheet.create({
  card: { backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.brandGreen + '22', marginBottom: 20, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen },
  countBadge: { backgroundColor: Colors.brandGreen + '18', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1 },
  countText: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen },
  list: { borderTopWidth: 1, borderTopColor: Colors.brandGreen + '15' },
  item: { paddingHorizontal: 16, paddingVertical: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  arabic: { flex: 1, fontSize: 18, color: Colors.brandGreen, fontWeight: '700', textAlign: 'right', lineHeight: 32 },
  repeatBadge: { backgroundColor: Colors.goldAccent + '22', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginTop: 4 },
  repeatText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '700' },
  expanded: { marginTop: 10 },
  transliteration: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, fontStyle: 'italic', lineHeight: 18, marginBottom: 8 },
  translation: { fontSize: 13, color: Colors.textPrimary, lineHeight: 20, marginBottom: 4 },
  source: { fontSize: 10, color: Colors.textPrimary, opacity: 0.35, marginTop: 2 },
});

const settStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  handle: { width: 36, height: 4, backgroundColor: Colors.brandGreen + '33', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.brandGreen, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  rowText: { flex: 1, paddingRight: 16 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  rowHint: { fontSize: 11, color: Colors.textPrimary, opacity: 0.5, marginTop: 2 },
  doneBtn: { marginTop: 24, backgroundColor: Colors.brandGreen, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
