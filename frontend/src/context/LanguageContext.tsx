import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'fr'
  );

  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Update body class for Arabic font
    if (lang === 'ar') {
      document.body.classList.add('arabic-text');
    } else {
      document.body.classList.remove('arabic-text');
    }
  };

  useEffect(() => {
    // Initialize language on mount
    setLanguage(language);
  }, []);

  const value = {
    language,
    setLanguage,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
