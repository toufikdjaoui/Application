import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Ressources simplifiées intégrées
const resources = {
  fr: {
    translation: {
      "common": {
        "loading": "Chargement...",
        "error": "Erreur"
      }
    }
  },
  ar: {
    translation: {
      "common": {
        "loading": "تحميل...",
        "error": "خطأ"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
