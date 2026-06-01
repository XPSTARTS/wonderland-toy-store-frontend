// stores/useAdminStore.ts
import { create } from 'zustand';
import api from '../services/api';

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

interface AdminStore {
  stats: AdminStats | null;
  orders: any[];
  products: any[];
  users: any[];
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
  createProduct: (productData: any) => Promise<void>;
  updateProduct: (productId: number, productData: any) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  updateUserRole: (userId: number, role: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  orders: [],
  products: [],
  users: [],
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get('/admin/dashboard');
      set({ stats: response, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response: any = await api.get('/orders/admin/all');
      set({ orders: response, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const response: any = await api.get('/products');
      let productsList = [];
      if (Array.isArray(response)) {
        productsList = response;
      } else if (response && response.items) {
        productsList = response.items;
      }
      set({ products: productsList, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const response: any = await api.get('/admin/users');
      set({ users: response, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      await get().fetchAllOrders();
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData: any) => {
    try {
      await api.post('/products', productData);
      await get().fetchAllProducts();
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productId: number, productData: any) => {
    try {
      await api.put(`/products/${productId}`, productData);
      await get().fetchAllProducts();
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId: number) => {
    try {
      await api.delete(`/products/${productId}`);
      await get().fetchAllProducts();
    } catch (error) {
      throw error;
    }
  },

  updateUserRole: async (userId: number, role: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, role);
      await get().fetchAllUsers();
    } catch (error) {
      throw error;
    }
  },
}));