import { create } from 'zustand';
import api from '../services/api';
import { Product } from '../types';

// Define the paginated response type
interface PaginatedResponse {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      // api.get returns the data directly (due to interceptor)
      // The response is of type PaginatedResponse
      const response = await api.get('/products') as PaginatedResponse;
      
      console.log('Products fetched:', response); // Debug
      
      // Extract items from the paginated response
      const productsList = response.items || [];
      
      set({ 
        products: productsList,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Failed to load products:', error);
      set({ error: error.message, isLoading: false, products: [] });
    }
  },

  getProductById: async (id: number) => {
    try {
      // api.get returns the product data directly
      const response = await api.get(`/products/${id}`) as Product;
      return response;
    } catch (error: any) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
}));