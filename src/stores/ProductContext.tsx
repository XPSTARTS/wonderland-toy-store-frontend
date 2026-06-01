import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  filteredProducts: Product[];  // Add this for frontend filtering
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: any = await api.get('/products');
      
      let productsArray: Product[] = [];
      
      if (Array.isArray(response)) {
        productsArray = response;
      } else if (response && response.items && Array.isArray(response.items)) {
        productsArray = response.items;
      }
      
      setAllProducts(productsArray);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters and sorting on the frontend
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    
    return result;
  }, [allProducts, searchTerm, selectedCategory, sortBy]);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products: filteredProducts,  // Return filtered products
      filteredProducts,
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