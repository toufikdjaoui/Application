import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import LanguageToggle from './LanguageToggle';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { isRTL } = useLanguage();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="text-2xl font-bold text-primary-600">
              Mode DZ
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('navigation.products')}
            </Link>
            <Link
              to="/boutiques"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('navigation.boutiques')}
            </Link>
            <Link
              to="/inspiration"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('navigation.inspiration')}
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {/* Cart Count Badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 rtl:space-x-reverse p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="hidden lg:block">{user?.firstName}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('navigation.profile')}
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('navigation.orders')}
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('navigation.settings')}
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('auth.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/products"
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.products')}
              </Link>
              <Link
                to="/boutiques"
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.boutiques')}
              </Link>
              <Link
                to="/inspiration"
                className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navigation.inspiration')}
              </Link>
              
              {isAuthenticated && (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.profile')}
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('navigation.orders')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
