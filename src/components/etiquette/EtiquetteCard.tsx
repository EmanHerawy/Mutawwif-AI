import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { EtiquetteItem, EtiquetteSeverity } from '../../types/etiquette.types';
import { Colors } from '../../theme/colors';
import { useAzkarPrefsStore } from '../../stores/azkarPrefsStore';

interface Props {
  item: EtiquetteItem;
}

const SEVERITY_BORDER: Record<EtiquetteSeverity, string> = {
  // الحرام: أحمر صريح (خطورة عالية/عقوبة)
  forbidden: Colors.danger, 
  
  // الواجب: برتقالي داكن (أهمية قصوى/لزوم الدم)
  // إذا لم يتوفر orange، استخدم Colors.goldAccent أو لون مخصص
  obligatory: '#83046a', 

  // المكروه: أصفر ذهبي (تنبيه/تجنب)
  disliked: Colors.goldAccent, 

  // السنة والمندوب: أخضر البراند (ثواب)
  recommended: '#1fe44a', 

  // المباح: لون أخضر فاتح جداً أو رمادي مائل للأزرق (إرشاد عام)
  // لتمييزه عن السنة التي لها أجر خاص
  permissible: '#95A5A6', 


};

const SEVERITY_LABEL: Record<EtiquetteSeverity, { ar: string; en: string }> = {
  obligatory: { ar: 'فرض', en: 'Obligation' },
  forbidden: { ar: 'حرام', en: 'Forbidden' },
  disliked: { ar: 'مكروه', en: 'Disliked' },
  recommended: { ar: 'مستحب', en: 'ٌRecommended' },
  permissible: { ar: 'مباح', en: 'Permissible' },
};

export function EtiquetteCard({ item }: Props) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const isAr = i18n.language?.startsWith('ar');

  const etiquetteFavoriteIds = useAzkarPrefsStore((s) => s.etiquetteFavoriteIds);
  const toggleEtiquetteFavorite = useAzkarPrefsStore((s) => s.toggleEtiquetteFavorite);
  const isFav = etiquetteFavoriteIds.includes(item.id);

  const borderColor = SEVERITY_BORDER[item.severity];
  const severityLabel = SEVERITY_LABEL[item.severity];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {t(item.titleKey)}
          </Text>
          <View style={[styles.severityBadge, { backgroundColor: borderColor + '22', borderColor }]}>
            <Text style={[styles.severityText, { color: borderColor }]}>
              {isAr ? severityLabel.ar : severityLabel.en}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => toggleEtiquetteFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.favBtn}
          >
            <FontAwesome5
              name="heart"
              solid={isFav}
              size={13}
              color={isFav ? '#E53E3E' : Colors.textPrimary}
              style={{ opacity: isFav ? 1 : 0.2 }}
            />
          </TouchableOpacity>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.body}>
          <Text style={[styles.content, isAr && styles.rtl]}>
            {t(item.contentKey)}
          </Text>
      {/* تم استبدال item.consequence بالحقول الجديدة مع التحقق من وجودها */}
{(isAr ? item.consequenceAr : item.consequenceEn) && (
  <View style={styles.consequenceBox}>
    <Text style={styles.consequenceLabel}>
      {t('etiquette.consequence_label')}
    </Text>
    <Text style={[styles.consequenceText, isAr && styles.rtl]}>
      {isAr ? item.consequenceAr : item.consequenceEn}
    </Text>
  </View>
)}
          {item.permitsMistake && (
            <View style={styles.forgivenessRow}>
              <Text style={styles.forgivenessText}>
                ✓ {t('etiquette.permits_mistake')}
              </Text>
            </View>
          )}
          <Text style={styles.source}>{item.source}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favBtn: { padding: 2 },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  severityBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.4,
    marginTop: 2,
  },
  body: {
    marginTop: 12,
    gap: 10,
  },
  content: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  rtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  consequenceBox: {
    backgroundColor: Colors.danger + '0D',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.danger,
    gap: 4,
  },
  consequenceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
    opacity: 0.8,
  },
  consequenceText: {
    fontSize: 13,
    color: Colors.danger,
  },
  forgivenessRow: {
    backgroundColor: Colors.brandGreen + '0D',
    borderRadius: 8,
    padding: 8,
  },
  forgivenessText: {
    fontSize: 12,
    color: Colors.brandGreen,
    fontWeight: '600',
  },
  source: {
    fontSize: 11,
    color: Colors.textPrimary,
    opacity: 0.45,
    fontStyle: 'italic',
  },
});
