import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { Cart, CartItem, AddToCartRequest } from '../types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          set({ cart: response.data, isLoading: false });
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ isLoading: false });
        }
      },

      addItem: async (productId, quantity) => {
        try {
          const response = await api.post('/cart/items', { productId, quantity });
          set({ cart: response.data });
        } catch (error: any) {
          console.error('Error adding to cart:', error);
          throw new Error(error.response?.data?.message || 'Failed to add to cart');
        }
      },

      updateItem: async (cartItemId, quantity) => {
        try {
          const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
          set({ cart: response.data });
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      },

      removeItem: async (cartItemId) => {
        try {
          const response = await api.delete(`/cart/items/${cartItemId}`);
          set({ cart: response.data });
        } catch (error) {
          console.error('Error removing item:', error);
        }
      },

      clearCart: async () => {
        try {
          const response = await api.delete('/cart/clear');
          set({ cart: response.data });
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);