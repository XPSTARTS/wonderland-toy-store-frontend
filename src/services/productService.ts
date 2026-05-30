// services/product.service.ts
import api from './api';

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

export interface GetProductsParams {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  sortBy?: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const productService = {
  // Get products with pagination
  getProducts: async (params: GetProductsParams): Promise<PagedResponse<Product>> => {
    // Use 'any' temporarily to bypass TypeScript issues
    const response: any = await api.get('/products', { params });
    
    // Return with proper shape
    return {
      items: response.items || [],
      page: response.page || params.page,
      pageSize: response.pageSize || params.pageSize,
      totalCount: response.totalCount || 0,
      totalPages: response.totalPages || 1,
      hasPrevious: response.hasPrevious || false,
      hasNext: response.hasNext || false
    };
  },
  
  // Get single product
  getProductById: async (id: number): Promise<Product> => {
    const response: any = await api.get(`/products/${id}`);
    
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      price: response.price,
      stockQuantity: response.stockQuantity,
      imageUrl: response.imageUrl,
      category: response.category,
      createdAt: response.createdAt
    };
  },
  
  // Get all categories (for filter dropdown)
  getCategories: async (): Promise<string[]> => {
    const response = await productService.getProducts({ page: 1, pageSize: 1000 });
    const categories = [...new Set(response.items.map(p => p.category))];
    return categories.filter(c => c);
  }
};