import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

interface Props {
  visible: boolean;
  onAcknowledge: () => void;
  onCancel: () => void;
}

/**
 * Mandatory speaker warning dialog — CLAUDE.md requirement.
 *
 * Must be shown before any audio plays in the Masjid context.
 * Non-dismissible via back button or tap-outside — only via explicit choice.
 * Resets on every new session start.
 */
export function SpeakerWarningDialog({ visible, onAcknowledge, onCancel }: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {/* non-dismissible via back button */}}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconRow}>
            <FontAwesome5 name="volume-mute" size={28} color={Colors.goldAccent} />
          </View>

          <Text style={styles.title}>{t('azkar.speaker_warning_title')}</Text>
          <Text style={styles.body}>{t('azkar.speaker_warning_body')}</Text>

          <View style={styles.rule}>
            <FontAwesome5 name="mosque" size={12} color={Colors.brandGreen} />
            <Text style={styles.ruleText}>{t('azkar.speaker_warning_rule')}</Text>
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={onAcknowledge}>
            <FontAwesome5 name="check" size={14} color={Colors.white} />
            <Text style={styles.btnPrimaryText}>{t('azkar.speaker_warning_confirm')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnGhost} onPress={onCancel}>
            <Text style={styles.btnGhostText}>{t('azkar.speaker_warning_cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },
  iconRow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.goldAccent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.brandGreen,
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.75,
    marginBottom: 14,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.brandGreen + '10',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.brandGreen,
    fontWeight: '600',
    flex: 1,
  },
  btnPrimary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.brandGreen,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  btnGhost: { paddingVertical: 10 },
  btnGhostText: { fontSize: 13, color: Colors.textPrimary, opacity: 0.45 },
});
