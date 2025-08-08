import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'fr' ? 'ar' : 'fr';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 rtl:space-x-reverse p-2 text-gray-700 hover:text-primary-600 transition-colors"
      title={language === 'fr' ? 'Switch to Arabic' : 'تبديل إلى الفرنسية'}
    >
      <LanguageIcon className="h-5 w-5" />
      <span className="hidden sm:block text-sm font-medium">
        {language === 'fr' ? 'العربية' : 'FR'}
      </span>
    </button>
  );
};

export default LanguageToggle;
