import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { TouchTarget, Spacing } from '../../theme/spacing';
import type { HeatStatus } from '../../types/health.types';

interface Props {
  visible: boolean;
  heatStatus: HeatStatus;
  tempCelsius: number | null;
  onDismiss: () => void;
  onDrankWater: () => void;
  onFindClinic?: () => void;
  onShown: () => void;
}

export function HeatAlertOverlay({
  visible,
  heatStatus,
  tempCelsius,
  onDismiss,
  onDrankWater,
  onFindClinic,
  onShown,
}: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) onShown();
  }, [visible, onShown]);

  const isExtreme = heatStatus === 'extreme';
  const temp = tempCelsius !== null ? String(Math.round(tempCelsius)) : '?';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Water drop icon placeholder */}
          <Text style={styles.icon}>💧</Text>

          <Text style={styles.title}>
            {isExtreme ? t('heat.extreme_title') : t('heat.danger_title')}
          </Text>

          <Text style={styles.body}>
            {isExtreme
              ? t('heat.extreme_body', { temp })
              : t('heat.danger_body', { temp })}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onDrankWater}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>{t('heat.i_drank_water')}</Text>
          </TouchableOpacity>

          {isExtreme && onFindClinic && (
            <TouchableOpacity
              style={styles.clinicButton}
              onPress={onFindClinic}
              accessibilityRole="button"
            >
              <Text style={styles.clinicButtonText}>{t('heat.nearest_clinic')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            accessibilityRole="button"
          >
            <Text style={styles.dismissText}>{t('heat.dismiss')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(216, 67, 21, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  body: {
    fontSize: 22,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 32,
  },
  primaryButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    minHeight: TouchTarget.standard,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: Colors.alertWarning,
    fontSize: 18,
    fontWeight: '700',
  },
  clinicButton: {
    backgroundColor: Colors.deepGreen,
    borderRadius: 12,
    minHeight: TouchTarget.standard,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: Spacing.md,
  },
  clinicButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    marginTop: Spacing.sm,
    minHeight: TouchTarget.standard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    color: Colors.white,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
