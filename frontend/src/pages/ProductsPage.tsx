import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

import { 
  productService, 
  ProductFilters as IProductFilters,
  ProductListResponse 
} from '../services/product';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import { useAuth } from '../context/AuthContext';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [filters, setFilters] = useState<IProductFilters>({});
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: IProductFilters = {};
    const urlPage = searchParams.get('page');
    const urlSort = searchParams.get('sort');

    // Extract filters from URL
    const filterKeys: (keyof IProductFilters)[] = [
      'category', 'subcategory', 'boutique_id', 'brand', 'color', 'size', 
      'condition', 'search', 'is_featured', 'is_trending'
    ];

    filterKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        if (key === 'min_price' || key === 'max_price') {
          urlFilters[key] = Number(value);
        } else if (key === 'is_featured' || key === 'is_trending' || key === 'in_stock_only') {
          urlFilters[key] = value === 'true';
        } else {
          urlFilters[key] = value;
        }
      }
    });

    setFilters(urlFilters);
    if (urlPage) setPage(Number(urlPage));
    if (urlSort) setSort(urlSort);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: IProductFilters, newSort: string, newPage: number) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    if (newSort !== 'relevance') params.set('sort', newSort);
    if (newPage !== 1) params.set('page', String(newPage));

    setSearchParams(params);
  }, [setSearchParams]);

  // Fetch products
  const { 
    data: productsData, 
    isLoading, 
    error 
  } = useQuery<ProductListResponse>(
    ['products', filters, sort, page],
    () => productService.getProducts(page, 20, sort, filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch categories and brands for filters
  const { data: categories = [] } = useQuery(
    'categories',
    productService.getCategories,
    { staleTime: 30 * 60 * 1000 } // 30 minutes
  );

  const { data: brands = [] } = useQuery(
    'brands',
    productService.getBrands,
    { staleTime: 30 * 60 * 1000 } // 30 minutes
  );

  // Handle filter changes
  const handleFiltersChange = (newFilters: IProductFilters) => {
    setFilters(newFilters);
    setPage(1);
    updateURL(newFilters, sort, 1);
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
    updateURL(filters, newSort, 1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(filters, sort, newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist handlers (placeholder - implement later)
  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }
    
    try {
      // TODO: Implement wishlist API call
      setWishlistProductIds(prev => new Set([...prev, productId]));
      toast.success(t('wishlist.addedToWishlist'));
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // TODO: Implement wishlist API call
      setWishlistProductIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      toast.success(t('wishlist.removedFromWishlist'));
    } catch (error) {
      toast.error('Erreur lors de la suppression des favoris');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('navigation.products')} - Mode DZ</title>
        <meta name="description" content="Découvrez notre collection de vêtements et accessoires de mode" />
        <meta name="keywords" content="mode, vêtements, accessoires, shopping, algérie" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('navigation.products')}
            </h1>
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600">
              <span>Accueil</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{t('navigation.products')}</span>
              {filters.category && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-gray-900">{filters.category}</span>
                </>
              )}
            </nav>
          </div>

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categories={categories}
                brands={brands}
                isLoading={isLoading}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              {/* Sort and Results Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <ProductSort
                  value={sort}
                  onChange={handleSortChange}
                  totalResults={productsData?.total}
                />
              </div>

              {/* Products Grid */}
              <ProductGrid
                products={productsData?.products || []}
                isLoading={isLoading}
                error={error ? 'Erreur lors du chargement des produits' : undefined}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                wishlistProductIds={wishlistProductIds}
              />

              {/* Pagination */}
              {productsData && productsData.total_pages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={productsData.total_pages}
                    onPageChange={handlePageChange}
                    totalItems={productsData.total}
                    itemsPerPage={20}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
