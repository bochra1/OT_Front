import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';

// i18next configuration
const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR }
};

// Get language from localStorage or use default
const getSavedLanguage = () => {
  const saved = localStorage.getItem('i18nextLng');
  return saved || 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(), // Get saved language or default to 'en'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;