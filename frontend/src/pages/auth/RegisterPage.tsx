import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  firstName: yup.string().required('Prénom requis').min(2, 'Minimum 2 caractères'),
  lastName: yup.string().required('Nom requis').min(2, 'Minimum 2 caractères'),
  email: yup.string().email('Email invalide').required('Email requis'),
  phone: yup.string().optional(),
  password: yup.string()
    .required('Mot de passe requis')
    .min(8, 'Minimum 8 caractères')
    .matches(/(?=.*[a-zA-Z])/, 'Doit contenir au moins une lettre')
    .matches(/(?=.*\d)/, 'Doit contenir au moins un chiffre'),
  confirmPassword: yup.string()
    .required('Confirmation requise')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
  language: yup.string().required('Langue requise')
});

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  language: string;
};

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      language: language
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success(t('auth.welcomeToModeDZ'));
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.register')} - Mode DZ</title>
        <meta name="description" content="Créez votre compte Mode DZ et découvrez la mode algérienne" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
              <div className="text-2xl font-bold text-primary-600">M</div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('auth.welcomeToModeDZ')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('auth.createYourAccount')}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    {t('auth.firstName')}
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className={`mt-1 input-base ${errors.firstName ? 'input-error' : ''}`}
                    placeholder={t('auth.firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    {t('auth.lastName')}
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    autoComplete="family-name"
                    className={`mt-1 input-base ${errors.lastName ? 'input-error' : ''}`}
                    placeholder={t('auth.lastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

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

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t('auth.phone')} <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  autoComplete="tel"
                  className="mt-1 input-base"
                  placeholder="+213 XXX XXX XXX"
                />
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  {t('common.language')}
                </label>
                <select
                  {...register('language')}
                  className={`mt-1 input-base ${errors.language ? 'input-error' : ''}`}
                >
                  <option value="fr">{t('common.french')}</option>
                  <option value="ar">{t('common.arabic')}</option>
                </select>
                {errors.language && (
                  <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>
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
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  {t('auth.confirmPassword')}
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input-base pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder={t('auth.confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
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
                  t('auth.createAccount')
                )}
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
