import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ur from './locales/ur.json';

const RESOURCES = {
  en: { translation: en },
  ur: { translation: ur },
};

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  // i18next v23+ requires detect() to return a Promise, not use a callback
  detect: () =>
    AsyncStorage.getItem('user-language')
      .then((lng) => lng || 'en')
      .catch(() => 'en'),
  init: () => {},
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem('user-language', lng).catch((error) =>
      console.log('Error saving language', error),
    );
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
