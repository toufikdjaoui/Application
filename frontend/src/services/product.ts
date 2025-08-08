import api from './auth';

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  boutique_id?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  color?: string;
  size?: string;
  condition?: string;
  search?: string;
  in_stock_only?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description: string;
  description_ar?: string;
  boutique_id: string;
  boutique_name: string;
  category: string;
  subcategory?: string;
  tags: string[];
  brand?: string;
  base_price: number;
  sale_price?: number;
  current_price: number;
  discount_percentage?: number;
  currency: string;
  main_image: string;
  images: string[];
  condition: string;
  status: string;
  is_featured: boolean;
  is_trending: boolean;
  is_in_stock: boolean;
  total_stock: number;
  rating: number;
  rating_count: number;
  sales_count: number;
  views: number;
  created_at: string;
}

export interface ProductDetail extends Product {
  variants: any[];
  colors: any[];
  material?: string;
  care_instructions?: string;
  shipping_details: any;
  seo: any;
  available_sizes: string[];
  available_colors: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Category {
  name: string;
  slug: string;
  product_count: number;
  subcategories: string[];
}

export interface Brand {
  name: string;
  product_count: number;
  logo?: string;
}

export const productService = {
  async getProducts(
    page = 1,
    size = 20,
    sort = 'relevance',
    filters: ProductFilters = {}
  ): Promise<ProductListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  async getProduct(id: string): Promise<ProductDetail> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ProductDetail> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  async getSimilarProducts(productId: string, limit = 8): Promise<Product[]> {
    const response = await api.get(`/products/${productId}/similar?limit=${limit}`);
    return response.data;
  },

  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  async getTrendingProducts(limit = 10): Promise<Product[]> {
    const response = await api.get(`/products/trending?limit=${limit}`);
    return response.data;
  },

  async getNewArrivals(limit = 10): Promise<Product[]> {
    const response = await api.get(`/products/new-arrivals?limit=${limit}`);
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/products/categories');
    return response.data;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await api.get('/products/brands');
    return response.data;
  },

  async createProduct(data: any): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
