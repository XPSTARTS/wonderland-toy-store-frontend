import { create } from 'zustand';
import api from '../services/api';
import { Order, CreateOrderRequest } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (shippingAddress: string) => Promise<Order>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderById: (id: number) => Promise<Order | null>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (shippingAddress: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/orders', { shippingAddress });
      const order = response.data.order;
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders');
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      set({ isLoading: false });
    }
  },

  fetchOrderById: async (id: number) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },
}));