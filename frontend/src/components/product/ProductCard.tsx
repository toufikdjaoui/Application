import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

import { Product } from '../../services/product';

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
  onRemoveFromWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showBoutique?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist = false,
  showBoutique = true
}) => {
  const { t } = useTranslation();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist && onRemoveFromWishlist) {
      onRemoveFromWishlist(product.id);
    } else if (!isInWishlist && onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square bg-gray-200 overflow-hidden">
            <img
              src={product.main_image || '/api/placeholder/300/300'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.is_featured && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
              ⭐ {t('product.featured')}
            </span>
          )}
          {product.is_trending && (
            <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded">
              🔥 {t('product.trending')}
            </span>
          )}
          {product.discount_percentage && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount_percentage}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          title={isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
        >
          {isInWishlist ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Stock Status */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white px-3 py-1 rounded text-sm font-medium text-gray-900">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Boutique */}
        {showBoutique && (
          <div className="text-xs text-gray-500 mb-1">
            <Link 
              to={`/boutiques/${product.boutique_id}`}
              className="hover:text-primary-600 transition-colors"
            >
              {product.boutique_name}
            </Link>
          </div>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{product.category}</span>
          {product.brand && <span>{product.brand}</span>}
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={clsx(
                    'h-4 w-4',
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.rating_count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.current_price)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>

          {/* Views */}
          <div className="flex items-center text-xs text-gray-500">
            <EyeIcon className="h-4 w-4 mr-1" />
            {product.views}
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
