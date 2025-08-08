import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    items,
    cartData,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    color?: string,
    size?: string
  ) => {
    if (newQuantity < 1) {
      removeItem(productId, color, size);
    } else {
      updateQuantity(productId, newQuantity, color, size);
    }
  };

  const handleRemoveItem = (productId: string, color?: string, size?: string) => {
    removeItem(productId, color, size);
    toast.success('Article retiré du panier');
  };

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
      toast.success('Panier vidé');
    }, 500);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour finaliser votre commande');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>{t('navigation.cart')} - Mode DZ</title>
          <meta name="description" content="Votre panier d'achats" />
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t('navigation.cart')}
            </h1>
            
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {t('cart.emptyCart')}
              </h2>
              <p className="text-gray-600 mb-8">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('navigation.cart')} ({items.length}) - Mode DZ</title>
        <meta name="description" content="Votre panier d'achats" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('navigation.cart')} ({cartData?.total_items || 0})
            </h1>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
            >
              {isClearing ? 'Suppression...' : 'Vider le panier'}
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <LoadingSpinner size="large" />
                    <p className="mt-4 text-gray-600">Mise à jour du panier...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cartData?.items.map((item, index) => (
                      <div key={`${item.product_id}-${item.color}-${item.size}`} className="p-6">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          {/* Product Image */}
                          <Link 
                            to={`/products/${item.product_id}`}
                            className="flex-shrink-0"
                          >
                            <img
                              src={item.product_image || '/api/placeholder/120/120'}
                              alt={item.product_name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          </Link>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/products/${item.product_id}`}
                              className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {item.product_name}
                            </Link>
                            
                            <p className="text-sm text-gray-500 mt-1">
                              {item.boutique_name}
                            </p>

                            {/* Variants */}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              {item.color && (
                                <span>Couleur: {item.color}</span>
                              )}
                              {item.size && (
                                <span>Taille: {item.size}</span>
                              )}
                            </div>

                            {/* Stock Status */}
                            {!item.is_in_stock ? (
                              <p className="text-red-600 text-sm mt-1">
                                ❌ Plus en stock
                              </p>
                            ) : item.available_stock < item.quantity ? (
                              <p className="text-orange-600 text-sm mt-1">
                                ⚠️ Stock limité ({item.available_stock} disponibles)
                              </p>
                            ) : null}

                            {/* Price */}
                            <div className="mt-2">
                              <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.unit_price)}
                              </span>
                              <span className="text-gray-500 ml-2">
                                × {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end space-y-2">
                            {/* Total Price */}
                            <div className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.total_price)}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(
                                  item.product_id,
                                  item.quantity - 1,
                                  item.color,
                                  item.size
                                )}
                                className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(
                                  item.product_id,
                                  item.quantity + 1,
                                  item.color,
                                  item.size
                                )}
                                disabled={item.quantity >= item.available_stock}
                                className="p-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Remove/Wishlist */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRemoveItem(
                                  item.product_id,
                                  item.color,
                                  item.size
                                )}
                                className="p-1 text-red-600 hover:text-red-700"
                                title="Supprimer"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 text-gray-600 hover:text-red-500"
                                title="Ajouter aux favoris"
                              >
                                <HeartIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← {t('cart.continueShopping')}
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Récapitulatif
                </h2>

                {cartData && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total ({cartData.total_items} articles)</span>
                      <span className="font-medium">{formatPrice(cartData.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium">
                        {cartData.shipping_cost === 0 ? (
                          <span className="text-green-600">Gratuite</span>
                        ) : (
                          formatPrice(cartData.shipping_cost)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TVA</span>
                      <span className="font-medium">{formatPrice(cartData.tax)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatPrice(cartData.total_amount)}
                        </span>
                      </div>
                    </div>

                    {cartData.shipping_cost === 0 && (
                      <div className="text-sm text-green-600 text-center">
                        ✓ Livraison gratuite activée !
                      </div>
                    )}
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!cartData || cartData.items.some((item: any) => !item.is_in_stock)}
                  className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isAuthenticated ? 'Se connecter pour commander' : t('cart.proceedToCheckout')}
                </button>

                {/* Security Note */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                  🔒 Paiement sécurisé • Livraison garantie
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
