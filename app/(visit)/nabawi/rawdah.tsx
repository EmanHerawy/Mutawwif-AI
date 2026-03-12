import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePersonaStore } from '../../../src/stores/personaStore';
import { ETIQUETTE_DATA } from '../../../src/data/etiquette';
import { VisitGuideScreen } from '../../../src/components/visit/VisitGuideScreen';
import { Colors } from '../../../src/theme/colors';

export default function RawdahVisitScreen() {
  const { t, i18n } = useTranslation();
  const persona = usePersonaStore((s) => s.persona);
  const gender = persona?.gender ?? 'male';
  const isAr = i18n.language?.startsWith('ar');

  const items = useMemo(() =>
    ETIQUETTE_DATA.filter((item) =>
      item.category === 'rawdah_adab' &&
      (item.applicableTo === 'all' || item.applicableTo === gender),
    ),
    [gender],
  );

  return (
    <VisitGuideScreen
      screenTitle={isAr ? 'الروضة الشريفة' : 'The Rawdah'}
      headerTitle={t('visit.rawdah_title')}
      headerSubtitle={t('visit.rawdah_subtitle')}
      iconName="star-of-life"
      iconColor={Colors.goldAccent}
      items={items}
      quote={t('visit.rawdah_hadith')}
    />
  );
}
