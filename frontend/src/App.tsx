import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// Components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import BoutiquesPage from './pages/BoutiquesPage';
import InspirationPage from './pages/InspirationPage';
import NotFoundPage from './pages/NotFoundPage';

// Hooks
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

function App() {
  const { t } = useTranslation();
  const { isLoading } = useAuth();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('common.loading')} - Mode DZ</title>
        <meta name="description" content="Mode DZ - Marketplace de mode algérien" />
        <meta name="keywords" content="mode, fashion, algérie, shopping, vêtements" />
        <meta property="og:title" content="Mode DZ - Marketplace de Mode" />
        <meta property="og:description" content="Découvrez les dernières tendances de mode en Algérie" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      </Helmet>

      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="boutiques" element={<BoutiquesPage />} />
            <Route path="inspiration" element={<InspirationPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
