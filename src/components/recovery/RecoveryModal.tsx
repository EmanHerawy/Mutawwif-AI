import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRitualStore } from '../../stores/ritualStore';
import { Colors } from '../../theme/colors';
import type { RitualCounterType } from '../../types/ritual.types';

interface Props {
  visible: boolean;
  ritual: RitualCounterType;
  completedLaps: number;
  lastSavedAt: Date | string | null;
  onResume: () => void;
  onStartOver: () => void;
  onMarkComplete: () => void;
}

function formatTime(date: Date | string | null): string {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function RecoveryModal({
  visible,
  ritual,
  completedLaps,
  lastSavedAt,
  onResume,
  onStartOver,
  onMarkComplete,
}: Props) {
  const { t } = useTranslation();

  const ritualLabel =
    ritual === 'tawaf' ? t('tracker.tawaf') : t('tracker.sai');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🕋</Text>
          <Text style={styles.title}>{t('recovery.title')}</Text>
          <Text style={styles.subtitle}>{t('recovery.subtitle')}</Text>

          <View style={styles.infoBox}>
            <Row label={t('recovery.ritual')} value={ritualLabel} />
            <Row
              label={t('recovery.laps')}
              value={`${completedLaps} / 7`}
            />
            <Row
              label={t('recovery.last_saved')}
              value={formatTime(lastSavedAt)}
            />
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={onResume}>
            <Text style={styles.btnPrimaryText}>{t('recovery.resume')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnGhost} onPress={onMarkComplete}>
            <Text style={styles.btnGhostText}>{t('recovery.mark_complete')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnDanger} onPress={onStartOver}>
            <Text style={styles.btnDangerText}>{t('recovery.start_over')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.brandGreen,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: Colors.parchmentBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 13, color: Colors.textPrimary, opacity: 0.55 },
  rowValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  btnPrimary: {
    width: '100%',
    backgroundColor: Colors.brandGreen,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  btnGhost: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.brandGreen + '55',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnGhostText: { fontSize: 14, fontWeight: '600', color: Colors.brandGreen },
  btnDanger: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnDangerText: { fontSize: 13, color: Colors.danger, opacity: 0.7 },
});
