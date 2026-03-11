import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../src/stores/personaStore';
import { useRitualStore } from '../../src/stores/ritualStore';
import { Colors } from '../../src/theme/colors';
import { UMRAH_STEPS } from '../../src/data/manasik-umrah';
import type { RitualStep, RitualStepStatus } from '../../src/types/ritual.types';

const STATUS_COLOR: Record<RitualStepStatus, string> = {
  pending: Colors.textPrimary + '33',
  active: Colors.goldAccent,
  completed: Colors.brandGreen,
  skipped: Colors.textPrimary + '22',
};

export default function GuideScreen() {
  const { t } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const { steps, currentStepId, setSteps, setCurrentStep } = useRitualStore();

  const isAr = (persona?.languageCode ?? 'en').startsWith('ar');
  const displaySteps: RitualStep[] = steps.length > 0 ? steps : UMRAH_STEPS;

  // Seed steps on first load
  useEffect(() => {
    if (steps.length === 0) setSteps(UMRAH_STEPS);
  }, []);

  const markActive = (stepId: string) => {
    const targetOrder = displaySteps.find((s) => s.id === stepId)?.order ?? 0;
    const updated = displaySteps.map((s) => ({
      ...s,
      status:
        s.id === stepId
          ? ('active' as RitualStepStatus)
          : s.order < targetOrder
          ? ('completed' as RitualStepStatus)
          : s.status,
    }));
    setSteps(updated);
    setCurrentStep(stepId);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>
          {persona?.ritualType === 'umrah' ? '🕋 Umrah Guide' : '🕌 Hajj Guide'}
        </Text>
        <Text style={styles.subtitle}>
          {isAr ? 'اضغط على خطوة لتفعيلها' : 'Tap a step to mark it active'}
        </Text>

        {displaySteps.map((step, idx) => {
          const isCurrentStep = step.id === currentStepId;
          const isDone = step.status === 'completed';
          const isActiveStep = step.status === 'active' || isCurrentStep;

          return (
            <TouchableOpacity
              key={step.id}
              style={styles.stepRow}
              onPress={() => markActive(step.id)}
              activeOpacity={0.75}
            >
              {/* Vertical connector */}
              {idx < displaySteps.length - 1 && (
                <View style={[styles.connector, isDone && styles.connectorDone]} />
              )}

              {/* Step circle */}
              <View style={[styles.circle, { borderColor: STATUS_COLOR[step.status] }, isActiveStep && styles.circleActive, isDone && styles.circleDone]}>
                <Text style={[styles.circleText, isDone && { color: Colors.white }, isActiveStep && { color: Colors.white }]}>
                  {isDone ? '✓' : isActiveStep ? '▶' : step.order}
                </Text>
              </View>

              {/* Content */}
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, isDone && styles.stepTitleDone, isActiveStep && styles.stepTitleActive]}>
                  {isAr ? step.titleAr : step.titleEn}
                </Text>
                {isActiveStep && (
                  <Text style={styles.stepDesc}>
                    {isAr ? step.descriptionAr : step.descriptionEn}
                  </Text>
                )}
                <View style={styles.badges}>
                  {step.hasCounter && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {step.counterType === 'tawaf' ? '🕋 Tawaf counter' : "🏃 Sa'i counter"}
                      </Text>
                    </View>
                  )}
                  {step.maleOnly && <Text style={styles.genderNote}>♂ Males only</Text>}
                  {step.femaleOnly && <Text style={styles.genderNote}>♀ Females only</Text>}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  scroll: { padding: 20, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.brandGreen, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textPrimary, opacity: 0.5, marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, position: 'relative' },
  connector: {
    position: 'absolute', left: 19, top: 44, width: 2, bottom: -10,
    backgroundColor: Colors.brandGreen + '20',
  },
  connectorDone: { backgroundColor: Colors.brandGreen + '55' },
  circle: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white, marginRight: 14, flexShrink: 0,
  },
  circleActive: { backgroundColor: Colors.goldAccent, borderColor: Colors.goldAccent },
  circleDone: { backgroundColor: Colors.brandGreen, borderColor: Colors.brandGreen },
  circleText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary + '66' },
  stepContent: { flex: 1, paddingBottom: 4 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  stepTitleActive: { color: Colors.goldAccent, fontWeight: '700' },
  stepTitleDone: { color: Colors.brandGreen },
  stepDesc: { fontSize: 13, color: Colors.textPrimary, opacity: 0.65, lineHeight: 20, marginBottom: 6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  badge: {
    backgroundColor: Colors.goldAccent + '20', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '600' },
  genderNote: { fontSize: 11, color: Colors.textPrimary, opacity: 0.4 },
});
