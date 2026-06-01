import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  sortBy: string;
  fetchProducts: () => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  setSearchTerm: (term: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = useCallback(async () => {
    console.log('🔵 Context: Fetching products with filters:', { searchTerm, selectedCategory, sortBy });
    setIsLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: 1,
        pageSize: 100,
        sortBy: sortBy
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response: any = await api.get('/products', { params });
      console.log('🔵 Context: Raw API response:', response);
      console.log('🔵 Context: Is response an array?', Array.isArray(response));
      
      // ✅ FIX: Handle both array response and paginated response
      let productsArray: Product[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array of products
        productsArray = response;
        console.log('🔵 Context: Response is direct array, length:', productsArray.length);
      } else if (response && response.items && Array.isArray(response.items)) {
        // Response is paginated { items: [...] }
        productsArray = response.items;
        console.log('🔵 Context: Response has items property, length:', productsArray.length);
      } else {
        console.log('🔵 Context: Unknown response format:', response);
        productsArray = [];
      }
      
      console.log('🔵 Context: Products array length:', productsArray.length);
      
      setProducts(productsArray);
      
    } catch (err: any) {
      console.error('🔵 Context: Error:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, sortBy]);

  const getProductById = async (id: number) => {
    try {
      const response: any = await api.get(`/products/${id}`);
      return response as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const setCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, fetchProducts]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading, 
      error, 
      searchTerm,
      selectedCategory,
      sortBy,
      fetchProducts, 
      getProductById,
      setSearchTerm,
      setCategory,
      setSortBy,
      resetFilters
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};