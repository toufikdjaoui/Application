import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('navigation.profile')} - Mode DZ</title>
        <meta name="description" content="Votre profil utilisateur" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('navigation.profile')}
          </h1>
          
          <div className="text-center py-16">
            <p className="text-lg text-gray-600">
              Page profil en cours de développement...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
