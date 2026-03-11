import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Badge } from '../ui/Badge';

interface Props {
  permitImageBase64: string;
  permitType: string | null;
  expiryDate: Date | null;
  holderName: string | null;
  nationality: string | null;
}

function daysUntil(date: Date): number {
  return Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function PermitCard({ permitImageBase64, permitType, expiryDate, holderName, nationality }: Props) {
  const { t } = useTranslation();
  const days = expiryDate ? daysUntil(expiryDate) : null;
  const isExpired = days !== null && days < 0;
  const isExpiringSoon = days !== null && days >= 0 && days <= 7;

  return (
    <View style={styles.card}>
      {permitImageBase64 ? (
        <Image
          source={{ uri: `data:image/png;base64,${permitImageBase64}` }}
          style={styles.qrImage}
          accessibilityLabel="Nusuk Permit QR Code"
          resizeMode="contain"
        />
      ) : (
        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrPlaceholderText}>{t('wallet.scan_permit')}</Text>
        </View>
      )}

      {isExpired && (
        <Badge label={t('wallet.permit_expired')} variant="disclaimer" style={styles.badge} />
      )}
      {isExpiringSoon && !isExpired && (
        <Badge
          label={t('wallet.permit_expiring_soon', { days })}
          variant="warning"
          style={styles.badge}
        />
      )}

      {holderName && (
        <Text style={styles.holderName}>{holderName}</Text>
      )}
      {permitType && (
        <Text style={styles.detail}>
          {t('wallet.permit_type')}: {permitType}
        </Text>
      )}
      {expiryDate && (
        <Text style={styles.detail}>
          {t('wallet.permit_expiry')}: {expiryDate.toLocaleDateString()}
        </Text>
      )}
      {nationality && (
        <Text style={styles.detail}>{nationality}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0D0',
  },
  qrImage: { width: 200, height: 200, marginBottom: Spacing.md },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  qrPlaceholderText: { color: '#999', fontSize: 14, textAlign: 'center' },
  badge: { marginBottom: Spacing.sm },
  holderName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  detail: { fontSize: 14, color: '#666', marginBottom: 2 },
});
