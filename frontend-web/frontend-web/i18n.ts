'use client';

import { appWithTranslation } from 'next-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from 'i18next-browser-languagedetector'; // Optional, to detect the browser language

i18next
  .use(initReactI18next) // Connect i18next with React
  .use(languageDetector) // Optional: auto-detect language
  .init({
    fallbackLng: 'en', // Default language
    resources: {
      en: {
        common: require('./public/locales/en/common.json'),
      },
      fr: {
        common: require('./public/locales/fr/common.json'),
      },
      ar: {
        common: require('./public/locales/ar/common.json'),
      },
    },
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  });

  export default i18next;
