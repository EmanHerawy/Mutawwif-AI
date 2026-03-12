import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useRitualStore } from '../../src/stores/ritualStore';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/theme/colors';
import { UMRAH_STEPS } from '../../src/data/manasik-umrah';
import { HAJJ_STEPS } from '../../src/data/manasik-hajj';
import type { RitualStep, RitualStepStatus } from '../../src/types/ritual.types';

import { isHajjSeason } from '../../src/utils/hajjSeason';
import ScreenBackground from '../../src/components/ScreenBackground';

export default function GuideScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const { steps, currentStepId, setSteps, setCurrentStep } = useRitualStore();

  const isAr = i18n.language.startsWith('ar');
  const ritualType = persona?.ritualType ?? 'umrah';
  const isHajj = ritualType !== 'umrah';
  const hajjEnabled = !isHajj || isHajjSeason();

  const baseSteps = isHajj ? HAJJ_STEPS : UMRAH_STEPS;
  const displaySteps: RitualStep[] = steps.length > 0 ? steps : baseSteps;
  const currentStep = displaySteps.find((s) => s.id === currentStepId) ?? null;
  const currentIdx = currentStep ? displaySteps.indexOf(currentStep) : -1;
  const hasStarted = !!currentStepId;

  useEffect(() => {
    if (steps.length === 0) setSteps(baseSteps);
  }, [baseSteps, steps.length, setSteps]);

  const startRitual = () => {
    const seeded = baseSteps.map((s, i) => ({
      ...s,
      status: (i === 0 ? 'active' : 'pending') as RitualStepStatus,
    }));
    setSteps(seeded);
    setCurrentStep(seeded[0].id);
  };

  const goNext = () => {
    if (currentIdx < 0 || currentIdx >= displaySteps.length - 1) return;
    const updated = displaySteps.map((s, i) => ({
      ...s,
      status: (
        i < currentIdx + 1 ? 'completed' :
        i === currentIdx + 1 ? 'active' : s.status
      ) as RitualStepStatus,
    }));
    setSteps(updated);
    setCurrentStep(displaySteps[currentIdx + 1].id);
  };

  const goPrev = () => {
    if (currentIdx <= 0) return;
    const updated = displaySteps.map((s, i) => ({
      ...s,
      status: (
        i < currentIdx - 1 ? 'completed' :
        i === currentIdx - 1 ? 'active' :
        i >= currentIdx ? 'pending' : s.status
      ) as RitualStepStatus,
    }));
    setSteps(updated);
    setCurrentStep(displaySteps[currentIdx - 1].id);
  };

  const resetRitual = () => {
    setSteps([]);
    setCurrentStep('');
  };

  // ── NOT STARTED — intro ──
  if (!hasStarted) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.introScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.introEmoji}>{isHajj ? '🕌' : '🕋'}</Text>
          <Text style={styles.introTitle}>{isHajj ? t('guide.hajj_title') : t('guide.umrah_title')}</Text>
          <Text style={styles.introSubtitle}>
            {t('guide.steps_count', { count: baseSteps.length })}
          </Text>

          <View style={styles.previewList}>
            {baseSteps.map((step, idx) => (
              <View key={step.id} style={styles.previewRow}>
                <View style={styles.previewNum}>
                  <Text style={styles.previewNumText}>{idx + 1}</Text>
                </View>
                <Text style={styles.previewTitle}>{isAr ? step.titleAr : step.titleEn}</Text>
              </View>
            ))}
          </View>

          {isHajj && !hajjEnabled ? (
            <View style={styles.hajjDisabledBox}>
              <Text style={styles.hajjDisabledText}>🕌 {t('guide.hajj_season_msg')}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.startBtn} onPress={startRitual}>
              <Text style={styles.startBtnText}>
                {isHajj ? t('guide.start_hajj') : t('guide.start_umrah')} →
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  // ── ACTIVE STEP ──
  const step = currentStep ?? displaySteps[0];
  const isLastStep = currentIdx === displaySteps.length - 1;
  const isFirstStep = currentIdx === 0;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{currentIdx + 1} / {displaySteps.length}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${((currentIdx + 1) / displaySteps.length) * 100}%` as any }]} />
          </View>
          <TouchableOpacity onPress={resetRitual}>
            <Text style={styles.resetLink}>{t('guide.reset')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepNumber}>{t('guide.step_label', { n: currentIdx + 1 })}</Text>
          <Text style={styles.stepTitle}>{isAr ? step.titleAr : step.titleEn}</Text>
          <View style={styles.divider} />
          <Text style={styles.stepDesc}>{isAr ? step.descriptionAr : step.descriptionEn}</Text>

          {step.hasCounter && (
            <TouchableOpacity style={styles.counterLinkBtn} onPress={() => router.push('/(tabs)/tracker')}>
              <Text style={styles.counterLinkText}>
                {step.counterType === 'tawaf'
                  ? `🕋 ${t('guide.open_tawaf_counter')}`
                  : `🏃 ${t('guide.open_sai_counter')}`}
              </Text>
            </TouchableOpacity>
          )}

          {step.maleOnly && (
            <View style={styles.genderBadge}>
              <Text style={styles.genderBadgeText}>♂ {t('guide.males_only')}</Text>
            </View>
          )}
          {step.femaleOnly && (
            <View style={styles.genderBadge}>
              <Text style={styles.genderBadgeText}>♀ {t('guide.females_only')}</Text>
            </View>
          )}
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, styles.navBtnGhost, isFirstStep && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={isFirstStep}
          >
            <Text style={[styles.navBtnText, { color: Colors.textPrimary }]}>← {t('guide.previous')}</Text>
          </TouchableOpacity>

          {isLastStep ? (
            <TouchableOpacity style={[styles.navBtn, { backgroundColor: Colors.goldAccent }]} onPress={resetRitual}>
              <Text style={[styles.navBtnText, { color: Colors.brandGreen }]}>✅ {t('guide.complete')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navBtn} onPress={goNext}>
              <Text style={styles.navBtnText}>{t('guide.next_step')} →</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.allStepsBox}>
          <Text style={styles.allStepsTitle}>{t('guide.all_steps')}</Text>
          {displaySteps.map((s, idx) => (
            <TouchableOpacity
              key={s.id}
              style={styles.allStepRow}
              onPress={() => {
                const updated = displaySteps.map((x, i) => ({
                  ...x,
                  status: (i < idx ? 'completed' : i === idx ? 'active' : 'pending') as RitualStepStatus,
                }));
                setSteps(updated);
                setCurrentStep(s.id);
              }}
            >
              <View style={[
                styles.allStepDot,
                s.status === 'completed' && styles.allStepDotDone,
                s.status === 'active' && styles.allStepDotActive,
              ]} />
              <Text style={[
                styles.allStepLabel,
                s.status === 'active' && { color: Colors.goldAccent, fontWeight: '700' },
                s.status === 'completed' && { color: Colors.brandGreen },
              ]}>
                {idx + 1}. {isAr ? s.titleAr : s.titleEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  introScroll: { padding: 24, paddingBottom: 48, alignItems: 'center' },
  introEmoji: { fontSize: 56, marginBottom: 16 },
  introTitle: { fontSize: 26, fontWeight: '800', color: Colors.brandGreen, marginBottom: 8, textAlign: 'center' },
  introSubtitle: { fontSize: 14, color: Colors.textPrimary, opacity: 0.55, textAlign: 'center', marginBottom: 28 },
  previewList: { width: '100%', marginBottom: 28 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '11' },
  previewNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.brandGreen + '18', alignItems: 'center', justifyContent: 'center' },
  previewNumText: { fontSize: 12, fontWeight: '700', color: Colors.brandGreen },
  previewTitle: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
  startBtn: { backgroundColor: Colors.brandGreen, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 40, alignItems: 'center' },
  startBtnText: { color: Colors.white, fontSize: 17, fontWeight: '800' },
  hajjDisabledBox: { backgroundColor: Colors.goldAccent + '15', borderRadius: 14, padding: 18, borderWidth: 1.5, borderColor: Colors.goldAccent + '44', alignItems: 'center' },
  hajjDisabledText: { fontSize: 14, color: Colors.goldAccent, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
  stepScroll: { padding: 20, paddingBottom: 48 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  progressText: { fontSize: 13, fontWeight: '700', color: Colors.brandGreen, width: 40 },
  progressTrack: { flex: 1, height: 6, backgroundColor: Colors.brandGreen + '20', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.brandGreen, borderRadius: 3 },
  resetLink: { fontSize: 12, color: Colors.textPrimary, opacity: 0.4 },
  stepCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 22, borderWidth: 1.5, borderColor: Colors.brandGreen + '33', marginBottom: 20 },
  stepNumber: { fontSize: 12, fontWeight: '700', color: Colors.goldAccent, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.brandGreen, marginBottom: 12 },
  divider: { height: 1, backgroundColor: Colors.brandGreen + '15', marginBottom: 14 },
  stepDesc: { fontSize: 15, color: Colors.textPrimary, lineHeight: 26, opacity: 0.8 },
  counterLinkBtn: { marginTop: 16, backgroundColor: Colors.goldAccent + '20', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.goldAccent + '44' },
  counterLinkText: { fontSize: 14, fontWeight: '700', color: Colors.goldAccent },
  genderBadge: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: Colors.brandGreen + '12', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  genderBadgeText: { fontSize: 12, color: Colors.brandGreen, fontWeight: '600' },
  navRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  navBtn: { flex: 1, backgroundColor: Colors.brandGreen, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  navBtnGhost: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '33' },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  allStepsBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.brandGreen + '22' },
  allStepsTitle: { fontSize: 11, fontWeight: '700', color: Colors.brandGreen, opacity: 0.55, marginBottom: 12, textTransform: 'uppercase' },
  allStepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '0A' },
  allStepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.textPrimary + '22', flexShrink: 0 },
  allStepDotDone: { backgroundColor: Colors.brandGreen },
  allStepDotActive: { backgroundColor: Colors.goldAccent },
  allStepLabel: { fontSize: 13, color: Colors.textPrimary, opacity: 0.65, flex: 1 },
});
