// stores/productStore.ts
import { create } from 'zustand';
import { productService, Product, PagedResponse } from '../services/productService';

interface ProductStore {
  // State
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  
  // Actions
  loadProducts: () => Promise<void>;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 20,
  isLoading: false,
  searchTerm: '',
  selectedCategory: '',
  sortBy: 'newest',
  
  // Actions
  loadProducts: async () => {
    const { currentPage, pageSize, searchTerm, selectedCategory, sortBy } = get();
    
    set({ isLoading: true });
    
    try {
      const response = await productService.getProducts({
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        sortBy: sortBy
      });
      
      set({
        products: response.items,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load products:', error);
      set({ isLoading: false });
    }
  },
  
  setPage: (page: number) => {
    set({ currentPage: page });
    get().loadProducts();
  },
  
  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 1 });
    get().loadProducts();
  },
  
  setCategory: (category: string) => {
    set({ selectedCategory: category, currentPage: 1 });
    get().loadProducts();
  },
  
  setSortBy: (sort: string) => {
    set({ sortBy: sort, currentPage: 1 });
    get().loadProducts();
  },
  
  resetFilters: () => {
    set({
      searchTerm: '',
      selectedCategory: '',
      sortBy: 'newest',
      currentPage: 1
    });
    get().loadProducts();
  }
}));