import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA } from '../../../src/data/etiquette';
import { VisitGuideScreen } from '../../../src/components/visit/VisitGuideScreen';

// Show items relevant to visiting Al Masjid Al Haram.
// Excludes hajj_umrah_rites and ihram categories — those belong in the Guide screen.
const EXCLUDED_CATEGORIES = new Set(['hajj_umrah_rites', 'ihram_prohibitions', 'ihram_permissions', 'hajj_management']);

export default function HaramVisitScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const persona = usePersonaStore((s) => s.persona);
  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const items = useMemo(() =>
    ETIQUETTE_DATA.filter((item) =>
      (item.mosque === 'haram' || item.mosque === 'both') &&
      !EXCLUDED_CATEGORIES.has(item.category) &&
      (item.applicableTo === 'all' || item.applicableTo === gender),
    ),
    [gender],
  );

  return (
    <VisitGuideScreen
      screenTitle={isAr ? 'المسجد الحرام' : 'Masjid Al Haram'}
      headerTitle={t('visit.haram_title')}
      headerSubtitle={t('visit.haram_subtitle')}
      iconName="mosque"
      items={items}
      navCards={[
        {
          titleEn: 'Gates',
          titleAr: 'البوابات',
          icon: 'door-open',
          onPress: () => router.push('/(visit)/haram/gates'),
        },
      ]}
    />
  );
}
