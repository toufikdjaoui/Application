import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
  totalResults?: number;
}

const ProductSort: React.FC<ProductSortProps> = ({
  value,
  onChange,
  totalResults
}) => {
  const { t } = useTranslation();

  const sortOptions = [
    { value: 'relevance', label: t('filters.relevance') },
    { value: 'price_asc', label: t('filters.priceAsc') },
    { value: 'price_desc', label: t('filters.priceDesc') },
    { value: 'newest', label: t('filters.newest') },
    { value: 'oldest', label: t('filters.oldest') },
    { value: 'popularity', label: t('filters.popularity') },
    { value: 'rating', label: t('filters.rating') },
    { value: 'sales', label: 'Meilleures ventes' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {totalResults !== undefined && (
          <span>
            {totalResults} {totalResults === 1 ? 'produit trouvé' : 'produits trouvés'}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <label htmlFor="sort" className="text-sm text-gray-700">
          {t('filters.sortBy')}:
        </label>
        <div className="relative">
          <select
            id="sort"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;
