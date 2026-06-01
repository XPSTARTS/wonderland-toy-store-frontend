import { create } from 'zustand';
import api from '../services/api';

// Define the Product type
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
  
  // Actions
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
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

  fetchProducts: async () => {
    const { searchTerm, selectedCategory, sortBy } = get();
    
    // console.log('📦 Store: Fetching products with filters:', { searchTerm, selectedCategory, sortBy });
    
    set({ isLoading: true, error: null });
    
    try {
      const params: any = {
        page: 1,
        pageSize: 100,
        sortBy: sortBy
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      // Use 'any' to bypass TypeScript issues with axios response
      const response: any = await api.get('/products', { params });
    //   console.log('📦 Store: API response received:', response);
      
      // Extract products - handles both array and paginated response
      let productsArray: Product[] = [];
      
      if (response && Array.isArray(response)) {
        // Response is directly an array
        productsArray = response;
      } else if (response && response.items && Array.isArray(response.items)) {
        // Response is paginated { items: [...] }
        productsArray = response.items;
      } else if (response && response.data && Array.isArray(response.data)) {
        // Response is wrapped in data property
        productsArray = response.data;
      }
      
    //   console.log('📦 Store: Extracted products count:', productsArray.length);
      
      set({ 
        products: productsArray,
        isLoading: false,
        error: null
      });
      
    } catch (error: any) {
      console.error('📦 Store: Error fetching products:', error);
      set({ 
        error: error.message || 'Failed to load products', 
        isLoading: false,
        products: []
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

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    // Debounce to avoid too many requests
    setTimeout(() => {
      get().fetchProducts();
    }, 300);
  },

  setCategory: (category: string) => {
    set({ selectedCategory: category });
    get().fetchProducts();
  },

  setSortBy: (sort: string) => {
    set({ sortBy: sort });
    get().fetchProducts();
  },

  resetFilters: () => {
    set({ 
      searchTerm: '', 
      selectedCategory: '', 
      sortBy: 'newest' 
    });
    get().fetchProducts();
  },
}));

// Export ProductProvider for main.tsx if needed
export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};