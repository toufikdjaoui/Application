import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Product } from '../../services/product';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string;
  onAddToWishlist?: (productId: string) => void;
  onRemoveFromWishlist?: (productId: string) => void;
  wishlistProductIds?: Set<string>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error,
  onAddToWishlist,
  onRemoveFromWishlist,
  wishlistProductIds = new Set()
}) => {
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">❌ Erreur de chargement</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche ou vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToWishlist={onAddToWishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
          isInWishlist={wishlistProductIds.has(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
