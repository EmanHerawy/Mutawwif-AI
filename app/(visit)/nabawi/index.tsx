import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA } from '../../../src/data/etiquette';
import { VisitGuideScreen } from '../../../src/components/visit/VisitGuideScreen';

const EXCLUDED_CATEGORIES = new Set(['hajj_umrah_rites', 'ihram_prohibitions', 'ihram_permissions', 'hajj_management']);

export default function NabawiVisitScreen() {
  const { t, i18n } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const items = useMemo(() =>
    ETIQUETTE_DATA.filter((item) =>
      (item.mosque === 'nabawi' || item.mosque === 'both') &&
      !EXCLUDED_CATEGORIES.has(item.category) &&
      (item.applicableTo === 'all' || item.applicableTo === gender),
    ),
    [gender],
  );

  return (
    <VisitGuideScreen
      screenTitle={isAr ? 'المسجد النبوي' : 'Masjid Al Nabawi'}
      headerTitle={t('visit.nabawi_title')}
      headerSubtitle={t('visit.nabawi_subtitle')}
      iconName="place-of-worship"
      items={items}
    />
  );
}
