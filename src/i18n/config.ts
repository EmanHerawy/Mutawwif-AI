import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

const RTL_LANGUAGES = ['ar', 'ar-EG', 'ar-SA', 'ur'];

export const initI18n = (languageCode: string) => {
  const isRTL = RTL_LANGUAGES.some((lang) => languageCode.startsWith(lang.split('-')[0]));
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL);

  return i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
};

export default i18n;
