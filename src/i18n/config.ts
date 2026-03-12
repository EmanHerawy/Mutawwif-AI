import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

const RTL_LANGUAGES = ['ar', 'ur'];

const applyRTL = (languageCode: string) => {
  const isRTL = RTL_LANGUAGES.some((lang) => languageCode.startsWith(lang));
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(isRTL);
};

let initialized = false;

export const initI18n = async (languageCode: string) => {
  applyRTL(languageCode);

  if (!initialized) {
    initialized = true;
    return i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      lng: languageCode,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v4',
    });
  }

  return i18n.changeLanguage(languageCode);
};

export default i18n;
