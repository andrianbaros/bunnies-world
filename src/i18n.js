import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storageService } from './services/storageService';
import dict from './locales/dictionary.json';

const savedLang = storageService.getSettings().language || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: dict.en },
    id: { translation: dict.id },
    ko: { translation: dict.ko },
    ja: { translation: dict.ja }
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
