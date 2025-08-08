import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const BoutiquesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('navigation.boutiques')} - Mode DZ</title>
        <meta name="description" content="Découvrez les boutiques partenaires de Mode DZ" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('navigation.boutiques')}
          </h1>
          
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">
              Liste des boutiques en cours de développement...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoutiquesPage;
