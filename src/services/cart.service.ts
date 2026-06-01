// services/cartService.ts
import api from './api';

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response;
  },

  // Add item
  addToCart: async (data: { productId: number; quantity: number }) => {
    const response = await api.post('/cart/items', data);
    return response;
  },

  // Update cart item
  updateCartItem: async (cartItemId: number, data: { quantity: number }) => {
    const response = await api.put(`/cart/items/${cartItemId}`, data);
    return response;
  },

  // Remove item
  removeFromCart: async (cartItemId: number) => {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response;
  },
};