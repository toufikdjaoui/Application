import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  ShareIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { productService, ProductDetail } from '../services/product';
import ProductGrid from '../components/product/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addItem } = useCart();

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Fetch product
  const { data: product, isLoading, error } = useQuery<ProductDetail>(
    ['product', id],
    () => productService.getProduct(id!),
    {
      enabled: !!id,
      retry: 1,
    }
  );

  // Fetch similar products
  const { data: similarProducts = [] } = useQuery(
    ['similar-products', id],
    () => productService.getSimilarProducts(id!),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Produit non trouvé
            </h2>
            <p className="text-gray-600 mb-8">
              Le produit que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retour aux produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  const allImages = [product.main_image, ...product.images].filter(Boolean);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter au panier');
      return;
    }

    if (!selectedColor && product.colors.length > 0) {
      toast.error('Veuillez sélectionner une couleur');
      return;
    }

    if (!selectedSize && product.available_sizes.length > 0) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }

    // Add to cart
    addItem({
      product_id: product.id,
      quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });

    toast.success('Produit ajouté au panier');
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }

    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Mode DZ</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.main_image} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.current_price.toString()} />
        <meta property="product:price:currency" content={product.currency} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-primary-600">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary-600">Produits</Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="lg:grid lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="p-6">
                {/* Main Image */}
                <div className="relative mb-4">
                  <div 
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                    onClick={() => setIsImageZoomed(true)}
                  >
                    <img
                      src={allImages[selectedImageIndex] || '/api/placeholder/600/600'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                    onClick={() => setIsImageZoomed(true)}
                  >
                    <MagnifyingGlassPlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Thumbnail Images */}
                {allImages.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={clsx(
                          'flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden',
                          selectedImageIndex === index
                            ? 'border-primary-600'
                            : 'border-gray-200'
                        )}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 lg:p-8">
                {/* Boutique */}
                <Link
                  to={`/boutiques/${product.boutique_id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 mb-2 block"
                >
                  {product.boutique_name}
                </Link>

                {/* Product Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={clsx(
                            'h-5 w-5',
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating} ({product.rating_count} avis)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.current_price)}
                    </span>
                    {product.sale_price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.base_price)}
                        </span>
                        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                          -{product.discount_percentage}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.is_in_stock ? (
                    <span className="text-green-600 flex items-center">
                      ✓ {product.total_stock} en stock
                    </span>
                  ) : (
                    <span className="text-red-600">
                      ❌ Rupture de stock
                    </span>
                  )}
                </div>

                {/* Colors */}
                {product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Couleur</h3>
                    <div className="flex space-x-2">
                      {product.colors.map((color: any) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={clsx(
                            'w-8 h-8 rounded border-2',
                            selectedColor === color.name
                              ? 'border-primary-600 ring-2 ring-primary-200'
                              : 'border-gray-300'
                          )}
                          style={{ backgroundColor: color.color_code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.available_sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Taille</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {product.available_sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={clsx(
                            'py-2 px-3 text-sm border rounded transition-colors',
                            selectedSize === size
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Quantité</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.is_in_stock}
                    className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {product.is_in_stock ? 'Ajouter au panier' : 'Rupture de stock'}
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleWishlistToggle}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {isInWishlist ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  {product.material && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Matière</h3>
                      <p className="text-gray-600">{product.material}</p>
                    </div>
                  )}

                  {product.care_instructions && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Entretien</h3>
                      <p className="text-gray-600">{product.care_instructions}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informations</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <dt className="text-gray-600">Marque:</dt>
                      <dd className="text-gray-900">{product.brand || 'Non spécifiée'}</dd>
                      <dt className="text-gray-600">État:</dt>
                      <dd className="text-gray-900">{product.condition}</dd>
                      <dt className="text-gray-600">Référence:</dt>
                      <dd className="text-gray-900">{product.id.slice(-8)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Produits similaires
              </h2>
              <ProductGrid
                products={similarProducts}
                showBoutique={true}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
