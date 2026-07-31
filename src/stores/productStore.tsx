// stores/productStore.ts
import { create } from 'zustand';
import api from '../services/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface ProductState {
  // State
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;

  // Actions
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
  sortBy: 'newest',
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 12, // Show 12 products per page

  fetchProducts: async () => {
    const { searchTerm, selectedCategory, sortBy, currentPage, pageSize } = get();
    set({ isLoading: true, error: null });

    try {
      const params: any = { page: currentPage, pageSize, sortBy };
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      console.log('📦 SENDING REQUEST TO:', `/products`, params);

      const response: any = await api.get('/products', { params });

      console.log('📦 FULL AXIOS RESPONSE:', response);
      console.log('📦 RESPONSE DATA:', response?.data);
      console.log('📦 RESPONSE KEYS:', Object.keys(response || {}));

      // We try to find products in the most likely places
      let productsArray = [];
      let totalPagesCount = 1;
      let totalItemsCount = 0;

      if (response?.data?.items) {
        productsArray = response.data.items;
        totalPagesCount = response.data.totalPages || 1;
        totalItemsCount = response.data.totalCount || 0;
      } else if (Array.isArray(response?.data)) {
        productsArray = response.data;
        totalItemsCount = productsArray.length;
      } else if (response?.items) {
        productsArray = response.items;
        totalPagesCount = response.totalPages || 1;
        totalItemsCount = response.totalCount || 0;
      } else {
        console.warn('📦 No products found in response!');
      }

      console.log('📦 FINAL PRODUCTS:', productsArray);

      set({
        products: productsArray,
        totalPages: totalPagesCount,
        totalCount: totalItemsCount,
        isLoading: false,
        error: null
      });

    } catch (error: any) {
      console.error('📦 Store Error:', error);
      set({ error: error.message || 'Failed to load products', isLoading: false, products: [] });
    }
  },

  getProductById: async (id: number) => {
    try {
      const response: any = await api.get(`/products/${id}`);
      return response as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 1 });
    get().fetchProducts();
  },

  setCategory: (category: string) => {
    set({ selectedCategory: category, currentPage: 1 });
    get().fetchProducts();
  },

  setSortBy: (sort: string) => {
    set({ sortBy: sort, currentPage: 1 });
    get().fetchProducts();
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchProducts();
  },

  resetFilters: () => {
    set({
      searchTerm: '',
      selectedCategory: '',
      sortBy: 'newest',
      currentPage: 1
    });
    get().fetchProducts();
  },
}));

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};