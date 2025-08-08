import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Mode DZ - Marketplace de Mode Algérien</title>
        <meta name="description" content="Découvrez les dernières tendances de mode en Algérie avec Mode DZ. Boutiques locales et internationales, essayage virtuel, inspiration mode." />
        <meta name="keywords" content="mode algérie, fashion algeria, boutique en ligne, vêtements, accessoires, shopping" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Mode DZ
                  <span className="block text-2xl md:text-3xl font-normal text-primary-200 mt-2">
                    Le Style Algérien à Votre Portée
                  </span>
                </h1>
                <p className="text-xl mb-8 text-primary-100">
                  Découvrez les dernières tendances de mode avec notre marketplace unique 
                  qui réunit boutiques locales et internationales. Essayage virtuel, 
                  inspiration mode et bien plus encore !
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {t('navigation.products')}
                    <ArrowRightIcon className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                  </Link>
                  <Link
                    to="/inspiration"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    {t('navigation.inspiration')}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Mode DZ Hero"
                    className="rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir Mode DZ ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Une expérience de shopping unique avec des fonctionnalités innovantes 
                conçues pour les amateurs de mode algériens
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Essayage Virtuel
                </h3>
                <p className="text-gray-600">
                  Essayez vos vêtements en réalité augmentée avant de les acheter
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FireIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recommandations IA
                </h3>
                <p className="text-gray-600">
                  Des suggestions personnalisées basées sur vos goûts et votre historique
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Livraison Rapide
                </h3>
                <p className="text-gray-600">
                  Livraison rapide dans toute l'Algérie avec suivi en temps réel
                </p>
              </div>

              {/* Feature 4 */}
              <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chat Marchand
                </h3>
                <p className="text-gray-600">
                  Discutez directement avec les boutiques pour vos questions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {t('product.featured')}
              </h2>
              <Link
                to="/products?featured=true"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                Voir tout
                <ArrowRightIcon className="ml-1 h-4 w-4 rtl:ml-0 rtl:mr-1 rtl:rotate-180" />
              </Link>
            </div>

            {/* Placeholder for featured products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {t('product.trending')}
              </h2>
              <Link
                to="/products?trending=true"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                Voir tout
                <ArrowRightIcon className="ml-1 h-4 w-4 rtl:ml-0 rtl:mr-1 rtl:rotate-180" />
              </Link>
            </div>

            {/* Placeholder for trending products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Découvrir Mode DZ ?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Rejoignez des milliers d'amateurs de mode qui font confiance à Mode DZ 
              pour leurs achats en ligne
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('auth.createAccount')}
              </Link>
              <Link
                to="/boutiques"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Devenir Marchand
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
