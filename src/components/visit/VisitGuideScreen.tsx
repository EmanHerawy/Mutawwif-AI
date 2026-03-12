import { View, Text, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import type { EtiquetteItem, EtiquetteSeverity } from '../../types/etiquette.types';
import { EtiquetteCard } from '../etiquette/EtiquetteCard';
import { Colors } from '../../theme/colors';

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY_ORDER: EtiquetteSeverity[] = [
  'forbidden',
  'obligatory',
  'recommended',
  'disliked',
  'permissible',
];

const SEVERITY_CONFIG: Record<EtiquetteSeverity, { icon: string; color: string; labelKey: string }> = {
  forbidden:   { icon: '🚫', color: Colors.danger,    labelKey: 'visit.section_forbidden' },
  obligatory:  { icon: '☑️', color: '#83046a',        labelKey: 'visit.section_obligatory' },
  recommended: { icon: '⭐', color: Colors.brandGreen, labelKey: 'visit.section_recommended' },
  disliked:    { icon: '⚠️', color: Colors.goldAccent, labelKey: 'visit.section_disliked' },
  permissible: { icon: '✅', color: '#7f8c8d',         labelKey: 'visit.section_permissible' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  /** Stack screen title (nav bar) */
  screenTitle: string;
  /** Large header title */
  headerTitle: string;
  headerSubtitle: string;
  /** FontAwesome5 icon name */
  iconName: string;
  iconColor?: string;
  /** Pre-filtered items for this location */
  items: EtiquetteItem[];
  /** Optional hadith / quote shown below header */
  quote?: string;
}

// ─── Severity section header ──────────────────────────────────────────────────

function SeverityHeader({ severity, count }: { severity: EtiquetteSeverity; count: number }) {
  const { t } = useTranslation();
  const cfg = SEVERITY_CONFIG[severity];
  return (
    <View style={[styles.sectionHeader, { borderLeftColor: cfg.color }]}>
      <Text style={styles.sectionIcon}>{cfg.icon}</Text>
      <Text style={[styles.sectionLabel, { color: cfg.color }]}>{t(cfg.labelKey)}</Text>
      <View style={[styles.sectionCount, { backgroundColor: cfg.color + '18' }]}>
        <Text style={[styles.sectionCountText, { color: cfg.color }]}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Visit header ─────────────────────────────────────────────────────────────

function VisitHeader({
  title, subtitle, iconName, iconColor, totalCount, quote, isAr,
}: {
  title: string; subtitle: string; iconName: string; iconColor: string;
  totalCount: number; quote?: string; isAr: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.headerCard}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconBox}>
          <FontAwesome5 name={iconName as any} size={30} color={iconColor} solid />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countNum}>{totalCount}</Text>
          <Text style={styles.countLabel}>{isAr ? 'حكم' : 'rules'}</Text>
        </View>
      </View>
      {!!quote && (
        <Text style={[styles.quote, isAr && styles.rtl]}>{quote}</Text>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function VisitGuideScreen({
  screenTitle,
  headerTitle,
  headerSubtitle,
  iconName,
  iconColor = Colors.brandGreen,
  items,
  quote,
}: Props) {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const sections = SEVERITY_ORDER
    .map((severity) => ({
      severity,
      data: items.filter((item) => item.severity === severity),
    }))
    .filter((s) => s.data.length > 0);

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: screenTitle }} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: EtiquetteItem }) => (
          <EtiquetteCard item={item} />
        )}
        renderSectionHeader={({ section }) => (
          <SeverityHeader severity={section.severity} count={section.data.length} />
        )}
        ListHeaderComponent={
          <VisitHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            iconName={iconName}
            iconColor={iconColor}
            totalCount={items.length}
            quote={quote}
            isAr={isAr}
          />
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  // Header card
  headerCard: {
    backgroundColor: Colors.brandGreen,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    marginTop: 12,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: Colors.white + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.goldAccent,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.75,
  },
  countBadge: {
    backgroundColor: Colors.goldAccent + '22',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.goldAccent + '55',
    minWidth: 50,
  },
  countNum: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.goldAccent,
    lineHeight: 20,
  },
  countLabel: {
    fontSize: 9,
    color: Colors.white,
    opacity: 0.7,
    fontWeight: '600',
  },
  quote: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.85,
    fontStyle: 'italic',
    lineHeight: 20,
    borderLeftWidth: 3,
    borderLeftColor: Colors.goldAccent,
    paddingLeft: 10,
  },
  rtl: { textAlign: 'right', writingDirection: 'rtl' },
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderRadius: 2,
  },
  sectionIcon: { fontSize: 16 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
