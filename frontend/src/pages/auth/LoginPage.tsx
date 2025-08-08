import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().required('Mot de passe requis'),
  rememberMe: yup.boolean()
});

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.rememberMe);
      toast.success(t('auth.welcomeBack'));
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.login')} - Mode DZ</title>
        <meta name="description" content="Connectez-vous à votre compte Mode DZ" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <div className="text-2xl font-bold text-primary-600">M</div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('auth.welcomeBack')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('auth.loginToYourAccount')}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('auth.email')}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`mt-1 input-base ${errors.email ? 'input-error' : ''}`}
                  placeholder={t('auth.email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('auth.password')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-base pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder={t('auth.password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('rememberMe')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  {t('auth.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  t('auth.login')
                )}
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('auth.dontHaveAccount')}{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
