import { create } from 'zustand';
import api from '../services/api';
import { AdminStats, Product, Order, User, CreateProductRequest } from '../types';

interface AdminState {
  stats: AdminStats | null;
  products: Product[];
  orders: Order[];
  users: User[];
  isLoading: boolean;
  
  fetchStats: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  createProduct: (product: CreateProductRequest) => Promise<void>;
  updateProduct: (id: number, product: CreateProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (userId: number, role: 'Customer' | 'Admin') => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  products: [],
  orders: [],
  users: [],
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/admin/dashboard');
      set({ stats: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ isLoading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
    }
  },

  createProduct: async (product: CreateProductRequest) => {
    try {
      const response = await api.post('/products', product);
      set({ products: [response.data.product, ...get().products] });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, product: CreateProductRequest) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      set({
        products: get().products.map(p => p.id === id ? response.data.product : p)
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      set({ products: get().products.filter(p => p.id !== id) });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders/admin/all');
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      set({
        orders: get().orders.map(o => o.id === orderId ? response.data.order : o)
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/admin/users');
      // Ensure role is properly typed
      const users = response.data.map((u: any) => ({
        ...u,
        role: u.role as 'Customer' | 'Admin'
      }));
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ isLoading: false });
    }
  },

  updateUserRole: async (userId: number, role: 'Customer' | 'Admin') => {
    try {
      await api.put(`/admin/users/${userId}/role`, JSON.stringify(role), {
        headers: { 'Content-Type': 'application/json' }
      });
      set({
        users: get().users.map(u => u.id === userId ? { ...u, role } : u)
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
}));