// stores/useOrderStore.ts
import { create } from 'zustand';
import api from '../services/api';

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  items?: any[];
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  placeOrder: (shippingAddress: string) => Promise<Order>;
  getUserOrders: () => Promise<void>;
  getOrderById: (id: number) => Promise<Order | null>;  // Add this method
  fetchOrderById: (id: number) => Promise<Order | null>; // Add this alias for compatibility
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  placeOrder: async (shippingAddress: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.post('/orders', { shippingAddress });
      console.log('Order placed:', response);
      set({ isLoading: false });
      return response.order || response;
    } catch (error: any) {
      console.error('Place order error:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  getUserOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get('/orders');
      console.log('User orders fetched:', response);
      
      let ordersList = [];
      if (Array.isArray(response)) {
        ordersList = response;
      } else if (response && response.items && Array.isArray(response.items)) {
        ordersList = response.items;
      } else if (response && response.data && Array.isArray(response.data)) {
        ordersList = response.data;
      }
      
      set({ orders: ordersList, isLoading: false });
    } catch (error: any) {
      console.error('Fetch orders error:', error);
      set({ orders: [], isLoading: false, error: error.message });
    }
  },

  getOrderById: async (id: number) => {
    try {
      const response: any = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Get order error:', error);
      return null;
    }
  },

  // Alias for compatibility with OrderConfirmation component
  fetchOrderById: async (id: number) => {
    try {
      const response: any = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('Fetch order error:', error);
      return null;
    }
  },
}));