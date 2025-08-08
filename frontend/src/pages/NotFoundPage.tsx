import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('errors.pageNotFound')} - Mode DZ</title>
        <meta name="description" content="Page non trouvée" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {t('errors.pageNotFound')}
            </h2>
            <p className="text-gray-600 mb-8">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            {t('errors.goHome')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
