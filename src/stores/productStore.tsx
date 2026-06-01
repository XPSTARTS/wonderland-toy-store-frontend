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
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
}

export const useProductStore = create<ProductState>((set, get) => {
  console.log('🔧 Store: Initializing store...');
  
  return {
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
      console.log('📦 Store: fetchProducts called');
      console.log('📦 Store: Current state before fetch:', get());
      
      set({ isLoading: true });
      console.log('📦 Store: After set isLoading true, new state:', get());
      
      try {
        const response: any = await api.get('/products');
        console.log('📦 Store: API response received:', response);
        console.log('📦 Store: Response type:', typeof response);
        console.log('📦 Store: Is response an array?', Array.isArray(response));
        console.log('📦 Store: Does response have items?', response && 'items' in response);
        
        const productsArray = response?.items || (Array.isArray(response) ? response : []);
        console.log('📦 Store: Extracted productsArray:', productsArray);
        console.log('📦 Store: Products count:', productsArray.length);
        
        // Use a callback to ensure we're not overwriting
        set((state) => {
          console.log('📦 Store: Inside set callback, current state:', state);
          return {
            products: productsArray,
            isLoading: false,
            error: null
          };
        });
        
        // Verify state after update
        const newState = get();
        console.log('📦 Store: State after update:', newState);
        console.log('📦 Store: Products in state after update:', newState.products);
        console.log('📦 Store: Products count after update:', newState.products.length);
        
      } catch (error: any) {
        console.error('📦 Store: Error:', error);
        set({ 
          products: [],
          isLoading: false,
          error: error.message || 'Failed to load products'
        });
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
  };
});