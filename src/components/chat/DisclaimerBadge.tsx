import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface Props {
  source: 'verified_local' | 'partial_local' | 'claude_api' | 'offline_fallback' | 'damm_lockout';
}

export function DisclaimerBadge({ source }: Props) {
  const { t } = useTranslation();

  if (source === 'verified_local') {
    return (
      <View style={[styles.badge, styles.verified]}>
        <Text style={[styles.text, styles.verifiedText]}>✓ {t('ask.source_verified')}</Text>
      </View>
    );
  }

  if (source === 'partial_local') {
    return (
      <View style={[styles.badge, styles.partial]}>
        <Text style={[styles.text, styles.partialText]}>~ {t('ask.source_partial')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.disclaimer]}>
      <Text style={[styles.text, styles.disclaimerText]}>⚠️ {t('ask.disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    padding: Spacing.xs,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  verified: { backgroundColor: '#E8F5E9' },
  partial: { backgroundColor: '#FFF8E1' },
  disclaimer: { backgroundColor: '#FBE9E7' },
  text: { fontSize: 11, fontWeight: '600' },
  verifiedText: { color: Colors.brandGreen },
  partialText: { color: '#F57F17' },
  disclaimerText: { color: Colors.alertWarning },
});
