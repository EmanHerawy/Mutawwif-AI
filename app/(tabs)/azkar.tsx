import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Modal, Switch, FlatList,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../src/theme/colors';
import { AZKAR_DATABASE } from '../../src/data/azkar-database';
import { formatAzkarSource } from '../../src/utils/formatAzkarSource';
import { useAzkarSessionStore } from '../../src/stores/azkarSessionStore';
import { useAzkarPrefsStore } from '../../src/stores/azkarPrefsStore';
import { SpeakerWarningDialog } from '../../src/components/azkar/SpeakerWarningDialog';
import type { AzkarItem } from '../../src/types/azkar.types';

type Category = string;
type Tab = 'categories' | 'favorites';

const CATEGORY_META: Record<string, { en: string; ar: string; icon: string }> = {
  talbiyah:       { en: 'Talbiyah',       ar: 'التلبية',        icon: 'microphone-alt' },
  entering_haram: { en: 'Enter Haram',    ar: 'دخول الحرم',     icon: 'mosque' },
  tawaf_general:  { en: 'Tawaf',          ar: 'الطواف',          icon: 'kaaba' },
  maqam_ibrahim:  { en: 'Maqam Ibrahim',  ar: 'مقام إبراهيم',   icon: 'pray' },
  sai:            { en: "Sa'i",           ar: 'السعي',           icon: 'running' },
  zamzam:         { en: 'Zamzam',         ar: 'زمزم',            icon: 'tint' },
  hajj_rites:     { en: 'Hajj Rites',     ar: 'مناسك الحج',      icon: 'campground' },
  nabawi:         { en: 'Al-Nabawi',      ar: 'المسجد النبوي',   icon: 'place-of-worship' },
  general:        { en: 'General',        ar: 'عامة',            icon: 'hands' },
};

const ORDERED_CATS = [
  'talbiyah', 'entering_haram', 'tawaf_general', 'maqam_ibrahim',
  'sai', 'zamzam', 'hajj_rites', 'nabawi', 'general',
];

export default function AzkarScreen() {
  const { i18n } = useTranslation();
  const isAr = i18n.language.startsWith('ar');

  const [tab, setTab] = useState<Tab>('categories');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showSpeakerWarning, setShowSpeakerWarning] = useState(false);
  const [pendingAudioId, setPendingAudioId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Session store
  const sessionActive = useAzkarSessionStore((s) => s.sessionActive);
  const counters = useAzkarSessionStore((s) => s.counters);
  const speakerAcknowledged = useAzkarSessionStore((s) => s.speakerWarningAcknowledged);
  const startSession = useAzkarSessionStore((s) => s.startSession);
  const endSession = useAzkarSessionStore((s) => s.endSession);
  const increment = useAzkarSessionStore((s) => s.increment);
  const resetItem = useAzkarSessionStore((s) => s.resetItem);
  const acknowledgeSpeakerWarning = useAzkarSessionStore((s) => s.acknowledgeSpeakerWarning);

  // Prefs store
  const showTranslation = useAzkarPrefsStore((s) => s.showTranslation);
  const showTransliteration = useAzkarPrefsStore((s) => s.showTransliteration);
  const showArabicText = useAzkarPrefsStore((s) => s.showArabicText);
  const favoriteIds = useAzkarPrefsStore((s) => s.favoriteIds);
  const toggleTranslation = useAzkarPrefsStore((s) => s.toggleTranslation);
  const toggleTransliteration = useAzkarPrefsStore((s) => s.toggleTransliteration);
  const toggleArabicText = useAzkarPrefsStore((s) => s.toggleArabicText);
  const toggleFavorite = useAzkarPrefsStore((s) => s.toggleFavorite);

  const favoriteItems = AZKAR_DATABASE.filter((z) => favoriteIds.includes(z.id));
  const items = tab === 'favorites'
    ? favoriteItems
    : activeCategory
      ? AZKAR_DATABASE.filter((z) => z.category === activeCategory)
      : [];

  const totalItems = items.length;
  const categoryDone = items.filter((i) => (counters[i.id] ?? 0) >= i.repeatCount).length;

  const handlePlayAudio = (item: AzkarItem) => {
    if (!item.audioFile) return;
    if (!speakerAcknowledged) {
      setPendingAudioId(item.id);
      setShowSpeakerWarning(true);
      return;
    }
  };

  const handleSpeakerAcknowledge = () => {
    acknowledgeSpeakerWarning();
    setShowSpeakerWarning(false);
    setPendingAudioId(null);
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setExpanded(null);
    setTab('categories');
  };

  const handleBack = () => {
    setActiveCategory(null);
    setExpanded(null);
  };

  const renderCard = (item: AzkarItem) => {
    const isOpen = expanded === item.id;
    const count = counters[item.id] ?? 0;
    const isDone = count >= item.repeatCount;
    const hasAudio = !!item.audioFile;
    const isFav = favoriteIds.includes(item.id);

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, isOpen && styles.cardOpen, isDone && sessionActive && styles.cardDone]}
        onPress={() => setExpanded(isOpen ? null : item.id)}
        activeOpacity={0.8}
      >
        {/* Header row: done badge + favorite */}
        <View style={styles.cardHeaderRow}>
          {isDone && sessionActive ? (
            <View style={styles.doneBadge}>
              <FontAwesome5 name="check" size={9} color={Colors.white} />
            </View>
          ) : <View style={styles.doneBadgePlaceholder} />}

          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesome5
              name={isFav ? 'heart' : 'heart'}
              solid={isFav}
              size={14}
              color={isFav ? '#E53E3E' : Colors.textPrimary}
              style={{ opacity: isFav ? 1 : 0.25 }}
            />
          </TouchableOpacity>
        </View>

        {!!(isAr ? item.occasionAr : item.occasionEn) && (
          <View style={styles.occasionRow}>
            <Text style={styles.occasionText}>
              {isAr ? item.occasionAr : item.occasionEn}
            </Text>
          </View>
        )}

        {showArabicText && (
          <Text style={styles.arabicText}>{item.arabicText}</Text>
        )}

        {item.repeatCount > 1 && (
          <View style={styles.repeatBadge}>
            <Text style={styles.repeatText}>×{item.repeatCount}</Text>
          </View>
        )}

        {isOpen && (
          <View style={styles.expandContent}>
            {showTransliteration && !!item.transliteration && (
              <Text style={styles.transliteration}>{item.transliteration}</Text>
            )}
            {(showTransliteration && !!item.transliteration) && (
              <View style={styles.divider} />
            )}
            {showTranslation && (
              <Text style={styles.translation}>{item.translationEn}</Text>
            )}
            {!!item.source && (
              <Text style={styles.source}>
                {formatAzkarSource(item.source, item.sourceAr, isAr)}
              </Text>
            )}

            {sessionActive && (
              <View style={styles.counterRow}>
                <TouchableOpacity style={styles.counterResetBtn} onPress={() => resetItem(item.id)}>
                  <FontAwesome5 name="undo" size={11} color={Colors.brandGreen} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tapBtn, isDone && styles.tapBtnDone]}
                  onPress={() => !isDone && increment(item.id)}
                  disabled={isDone}
                >
                  <Text style={styles.tapBtnCount}>{count}</Text>
                  <Text style={styles.tapBtnOf}>/ {item.repeatCount}</Text>
                </TouchableOpacity>
                {hasAudio && (
                  <TouchableOpacity style={styles.audioBtn} onPress={() => handlePlayAudio(item)}>
                    <FontAwesome5 name="volume-up" size={14} color={Colors.brandGreen} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Top tab switcher + settings */}
      <View style={styles.topBar}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'categories' && styles.tabBtnActive]}
            onPress={() => setTab('categories')}
          >
            <FontAwesome5
              name="th-large"
              size={12}
              color={tab === 'categories' ? Colors.white : Colors.brandGreen}
            />
            <Text style={[styles.tabBtnLabel, tab === 'categories' && styles.tabBtnLabelActive]}>
              {isAr ? 'الفئات' : 'Categories'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'favorites' && styles.tabBtnActive]}
            onPress={() => { setTab('favorites'); setActiveCategory(null); }}
          >
            <FontAwesome5
              name="heart"
              solid
              size={12}
              color={tab === 'favorites' ? Colors.white : '#E53E3E'}
            />
            <Text style={[styles.tabBtnLabel, tab === 'favorites' && styles.tabBtnLabelActive]}>
              {isAr ? 'المفضلة' : 'Favorites'}
              {favoriteIds.length > 0 && (
                <Text style={styles.favCount}> {favoriteIds.length}</Text>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowSettings(true)}>
          <FontAwesome5 name="sliders-h" size={15} color={Colors.brandGreen} />
        </TouchableOpacity>
      </View>

      {/* Category grid (when Categories tab, no active category) */}
      {tab === 'categories' && !activeCategory && (
        <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {ORDERED_CATS.map((cat) => {
              const meta = CATEGORY_META[cat] ?? { en: cat, ar: cat, icon: 'circle' };
              const catItems = AZKAR_DATABASE.filter((z) => z.category === cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={styles.gridCard}
                  onPress={() => handleCategorySelect(cat)}
                  activeOpacity={0.75}
                >
                  <View style={styles.gridIconWrap}>
                    <FontAwesome5 name={meta.icon as any} size={22} color={Colors.brandGreen} />
                  </View>
                  <Text style={styles.gridLabel}>{isAr ? meta.ar : meta.en}</Text>
                  <Text style={styles.gridCount}>{catItems.length}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Item list (active category or favorites) */}
      {(tab === 'favorites' || (tab === 'categories' && activeCategory)) && (
        <>
          {/* Back / breadcrumb row */}
          <View style={styles.breadcrumb}>
            {tab === 'categories' && activeCategory && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <FontAwesome5 name="arrow-left" size={12} color={Colors.brandGreen} />
                <Text style={styles.backLabel}>{isAr ? 'الفئات' : 'Categories'}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.breadcrumbTitle}>
              {tab === 'favorites'
                ? (isAr ? 'المفضلة' : 'Favorites')
                : (isAr
                    ? CATEGORY_META[activeCategory!]?.ar
                    : CATEGORY_META[activeCategory!]?.en)}
            </Text>
          </View>

          {/* Session bar */}
          <View style={styles.sessionBar}>
            {sessionActive ? (
              <>
                <View style={styles.sessionProgress}>
                  <Text style={styles.sessionProgressText}>
                    {categoryDone}/{totalItems} {isAr ? 'مكتمل' : 'done'}
                  </Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${totalItems > 0 ? (categoryDone / totalItems) * 100 : 0}%` as any }]} />
                  </View>
                </View>
                <TouchableOpacity style={styles.endSessionBtn} onPress={endSession}>
                  <Text style={styles.endSessionText}>{isAr ? 'إنهاء' : 'End'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.startSessionBtn} onPress={startSession}>
                <FontAwesome5 name="play" size={11} color={Colors.white} />
                <Text style={styles.startSessionText}>{isAr ? 'بدء جلسة ذكر' : 'Start Dhikr Session'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5
                  name={tab === 'favorites' ? 'heart' : 'moon'}
                  size={36}
                  color={Colors.brandGreen}
                  style={{ opacity: 0.2, marginBottom: 12 }}
                />
                <Text style={styles.emptyNote}>
                  {tab === 'favorites'
                    ? (isAr ? 'لا توجد مفضلة بعد.\nاضغط ♡ على أي ذكر لحفظه.' : 'No favorites yet.\nTap ♡ on any dhikr to save it.')
                    : (isAr ? 'لا توجد أذكار في هذه الفئة بعد.' : 'No Athkar in this category yet.')}
                </Text>
              </View>
            ) : (
              items.map(renderCard)
            )}
          </ScrollView>
        </>
      )}

      {/* Settings modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSettings(false)} />
        <View style={styles.settingsSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{isAr ? 'إعدادات العرض' : 'Display Settings'}</Text>

          <SettingRow
            label={isAr ? 'إظهار النص العربي' : 'Show Arabic Text'}
            value={showArabicText}
            onToggle={toggleArabicText}
          />
          <SettingRow
            label={isAr ? 'إظهار الترجمة' : 'Show Translation'}
            value={showTranslation}
            onToggle={toggleTranslation}
          />
          <SettingRow
            label={isAr ? 'إظهار النطق' : 'Show Transliteration'}
            value={showTransliteration}
            onToggle={toggleTransliteration}
          />
          <TouchableOpacity style={styles.closePillBtn} onPress={() => setShowSettings(false)}>
            <Text style={styles.closePillText}>{isAr ? 'إغلاق' : 'Close'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <SpeakerWarningDialog
        visible={showSpeakerWarning}
        onAcknowledge={handleSpeakerAcknowledge}
        onCancel={() => { setShowSpeakerWarning(false); setPendingAudioId(null); }}
      />
    </SafeAreaView>
  );
}

function SettingRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.brandGreen + '33', true: Colors.brandGreen }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchmentBg },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12,
  },
  tabSwitcher: {
    flex: 1, flexDirection: 'row',
    backgroundColor: Colors.brandGreen + '14',
    borderRadius: 12, padding: 3, gap: 3,
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 8, borderRadius: 9,
  },
  tabBtnActive: { backgroundColor: Colors.brandGreen },
  tabBtnLabel: { fontSize: 13, fontWeight: '600', color: Colors.brandGreen },
  tabBtnLabelActive: { color: Colors.white },
  favCount: { fontSize: 11, fontWeight: '700' },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
    alignItems: 'center', justifyContent: 'center',
  },

  // Category grid
  gridScroll: { padding: 16, paddingBottom: 48 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
  },
  gridCard: {
    width: '30%',
    backgroundColor: Colors.white, borderRadius: 14,
    padding: 14, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.brandGreen + '20',
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  gridIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.brandGreen + '12',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12, fontWeight: '700', color: Colors.textPrimary,
    textAlign: 'center', marginBottom: 4,
  },
  gridCount: {
    fontSize: 11, color: Colors.brandGreen, fontWeight: '600', opacity: 0.7,
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8, gap: 10,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
    backgroundColor: Colors.brandGreen + '12',
  },
  backLabel: { fontSize: 12, color: Colors.brandGreen, fontWeight: '600' },
  breadcrumbTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1,
  },

  // Session bar
  sessionBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 10, gap: 12,
  },
  startSessionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.brandGreen, borderRadius: 10, paddingVertical: 10,
  },
  startSessionText: { fontSize: 13, fontWeight: '700', color: Colors.white },
  sessionProgress: { flex: 1, gap: 4 },
  sessionProgressText: { fontSize: 11, color: Colors.brandGreen, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: Colors.brandGreen + '22', borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.brandGreen, borderRadius: 2 },
  endSessionBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1.5, borderColor: Colors.brandGreen + '44',
  },
  endSessionText: { fontSize: 12, fontWeight: '600', color: Colors.brandGreen },

  // Cards
  scroll: { padding: 16, paddingBottom: 48 },
  card: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 18,
    marginBottom: 12, borderWidth: 1.5, borderColor: Colors.brandGreen + '22',
    overflow: 'hidden',
  },
  cardOpen: { borderColor: Colors.brandGreen },
  cardDone: { borderColor: Colors.brandGreen + '88', backgroundColor: Colors.brandGreen + '08' },

  cardHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 4,
  },
  doneBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.brandGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  doneBadgePlaceholder: { width: 20, height: 20 },
  favBtn: { padding: 4 },

  occasionRow: {
    backgroundColor: Colors.goldAccent + '18', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4, marginBottom: 10,
  },
  occasionText: {
    fontSize: 11, color: Colors.goldAccent, fontWeight: '600',
    textAlign: 'right', lineHeight: 17, flexShrink: 1,
  },
  arabicText: {
    fontSize: 22, color: Colors.brandGreen, fontWeight: '700',
    textAlign: 'right', lineHeight: 38, marginBottom: 4,
    flexShrink: 1, flexWrap: 'wrap',
  },
  repeatBadge: {
    alignSelf: 'flex-end', backgroundColor: Colors.goldAccent + '25',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 4,
  },
  repeatText: { fontSize: 11, color: Colors.goldAccent, fontWeight: '700' },
  expandContent: { marginTop: 12 },
  transliteration: {
    fontSize: 12, color: Colors.textPrimary, opacity: 0.5,
    fontStyle: 'italic', lineHeight: 20, marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: Colors.brandGreen + '15', marginBottom: 10 },
  translation: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, marginBottom: 6 },
  source: { fontSize: 10, color: Colors.textPrimary, opacity: 0.35, marginTop: 2, marginBottom: 12 },
  chevron: { fontSize: 10, color: Colors.textPrimary, opacity: 0.25, textAlign: 'right', marginTop: 4 },

  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  counterResetBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: Colors.brandGreen + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  tapBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, backgroundColor: Colors.brandGreen, borderRadius: 12, paddingVertical: 12,
  },
  tapBtnDone: { backgroundColor: Colors.brandGreen + '55' },
  tapBtnCount: { fontSize: 20, fontWeight: '800', color: Colors.white },
  tapBtnOf: { fontSize: 12, color: Colors.white, opacity: 0.7, marginTop: 3 },
  audioBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.brandGreen + '15',
    alignItems: 'center', justifyContent: 'center',
  },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyNote: {
    fontSize: 14, color: Colors.textPrimary, opacity: 0.4,
    textAlign: 'center', lineHeight: 22,
  },

  // Settings modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
  },
  settingsSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 16,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.textPrimary, opacity: 0.15,
    alignSelf: 'center', marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18, fontWeight: '700', color: Colors.textPrimary,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.brandGreen + '10',
  },
  settingLabel: { fontSize: 15, color: Colors.textPrimary, flex: 1 },
  closePillBtn: {
    marginTop: 24, alignSelf: 'center',
    backgroundColor: Colors.brandGreen, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 12,
  },
  closePillText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
