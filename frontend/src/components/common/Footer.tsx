import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* About Mode DZ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mode DZ</h3>
            <p className="text-gray-300 mb-4">
              Le marketplace de mode algérien qui connecte les boutiques locales et internationales 
              avec les amateurs de mode.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.297 0-4.163-1.866-4.163-4.163 0-2.297 1.866-4.163 4.163-4.163 2.297 0 4.163 1.866 4.163 4.163 0 2.297-1.866 4.163-4.163 4.163zm7.718 0c-2.297 0-4.163-1.866-4.163-4.163 0-2.297 1.866-4.163 4.163-4.163 2.297 0 4.163 1.866 4.163 4.163 0 2.297-1.866 4.163-4.163 4.163z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.products')}
                </Link>
              </li>
              <li>
                <Link to="/boutiques" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.boutiques')}
                </Link>
              </li>
              <li>
                <Link to="/inspiration" className="text-gray-300 hover:text-white transition-colors">
                  {t('navigation.inspiration')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.shippingInfo')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.returnPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">Alger, Algérie</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">+213 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">contact@modedz.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">{t('footer.newsletter')}</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder={t('footer.enterEmail')}
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Mode DZ. {t('footer.allRightsReserved')}.
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
