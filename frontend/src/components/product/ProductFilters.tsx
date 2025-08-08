import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { ProductFilters as IProductFilters, Category, Brand } from '../../services/product';

interface ProductFiltersProps {
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  categories: Category[];
  brands: Brand[];
  isLoading?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  brands,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['category', 'price'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilters = (newFilters: Partial<IProductFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof IProductFilters] !== undefined && filters[key as keyof IProductFilters] !== ''
  );

  const conditions = [
    { value: 'new', label: t('filters.new') },
    { value: 'used_like_new', label: 'Comme neuf' },
    { value: 'used_good', label: 'Bon état' },
    { value: 'used_fair', label: 'État correct' },
  ];

  const colors = [
    { value: 'noir', label: 'Noir', color: '#000000' },
    { value: 'blanc', label: 'Blanc', color: '#FFFFFF' },
    { value: 'rouge', label: 'Rouge', color: '#EF4444' },
    { value: 'bleu', label: 'Bleu', color: '#3B82F6' },
    { value: 'vert', label: 'Vert', color: '#10B981' },
    { value: 'jaune', label: 'Jaune', color: '#F59E0B' },
    { value: 'rose', label: 'Rose', color: '#EC4899' },
    { value: 'violet', label: 'Violet', color: '#8B5CF6' },
    { value: 'orange', label: 'Orange', color: '#F97316' },
    { value: 'marron', label: 'Marron', color: '#A78BFA' },
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL',
    '34', '36', '38', '40', '42', '44', '46', '48',
    '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5" />
            <span className="font-medium">{t('filters.filters')}</span>
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </div>
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Filter Content */}
      <div className={clsx('p-4 space-y-6', !isOpen && 'hidden lg:block')}>
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            {t('filters.filters')}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {t('filters.clearFilters')}
            </button>
          )}
        </div>

        {/* Stock Filter */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.in_stock_only !== false}
              onChange={(e) => updateFilters({ in_stock_only: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">En stock uniquement</span>
          </label>
        </div>

        {/* Category Filter */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.categories')}</span>
            {expandedSections.has('category') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('category') && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category.name} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={filters.category === category.name}
                    onChange={(e) => updateFilters({ 
                      category: e.target.value,
                      subcategory: undefined 
                    })}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.product_count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Subcategory Filter */}
        {filters.category && (
          <div>
            <span className="font-medium text-gray-900 block mb-3">Sous-catégories</span>
            <div className="space-y-2">
              {categories
                .find(c => c.name === filters.category)
                ?.subcategories.map((subcategory) => (
                <label key={subcategory} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="subcategory"
                    value={subcategory}
                    checked={filters.subcategory === subcategory}
                    onChange={(e) => updateFilters({ subcategory: e.target.value })}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{subcategory}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.priceRange')}</span>
            {expandedSections.has('price') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('price') && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {t('filters.minPrice')}
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.min_price || ''}
                    onChange={(e) => updateFilters({ 
                      min_price: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {t('filters.maxPrice')}
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filters.max_price || ''}
                    onChange={(e) => updateFilters({ 
                      max_price: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.brands')}</span>
            {expandedSections.has('brand') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('brand') && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand.name} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="brand"
                    value={brand.name}
                    checked={filters.brand === brand.name}
                    onChange={(e) => updateFilters({ brand: e.target.value })}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {brand.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({brand.product_count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div>
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.colors')}</span>
            {expandedSections.has('color') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('color') && (
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateFilters({ 
                    color: filters.color === color.value ? undefined : color.value 
                  })}
                  className={clsx(
                    'w-8 h-8 rounded border-2 relative',
                    filters.color === color.value 
                      ? 'border-primary-600 ring-2 ring-primary-200' 
                      : 'border-gray-300'
                  )}
                  style={{ backgroundColor: color.color }}
                  title={color.label}
                >
                  {color.value === 'blanc' && (
                    <div className="absolute inset-0 border border-gray-300 rounded"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div>
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.sizes')}</span>
            {expandedSections.has('size') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('size') && (
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilters({ 
                    size: filters.size === size ? undefined : size 
                  })}
                  className={clsx(
                    'py-2 px-3 text-sm border rounded transition-colors',
                    filters.size === size
                      ? 'border-primary-600 bg-primary-50 text-primary-600'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Condition Filter */}
        <div>
          <button
            onClick={() => toggleSection('condition')}
            className="w-full flex items-center justify-between mb-3"
          >
            <span className="font-medium text-gray-900">{t('filters.condition')}</span>
            {expandedSections.has('condition') ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.has('condition') && (
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="condition"
                    value={condition.value}
                    checked={filters.condition === condition.value}
                    onChange={(e) => updateFilters({ condition: e.target.value })}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{condition.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters - Mobile */}
        <div className="lg:hidden pt-4 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={!hasActiveFilters}
          >
            {t('filters.clearFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
