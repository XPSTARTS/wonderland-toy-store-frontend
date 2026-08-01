import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cart.service';
import { authService } from '../services/authService';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItemLocally: (product: any, quantity: number) => void;
  updateQuantityLocally: (productId: number, quantity: number) => void;
  removeItemLocally: (productId: number) => void;
  clearCartLocally: () => void;
  syncWithBackend: () => Promise<void>;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const response: any = await cartService.getCart();

          let freshItems: any[] = [];
          if (Array.isArray(response)) {
            freshItems = response;
          } else if (response && response.items) {
            freshItems = response.items;
          }

          const syncedItems = freshItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl || '',
            subtotal: item.productPrice * item.quantity
          }));

          set({ items: syncedItems, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ isLoading: false });
        }
      },

      items: [],
      isLoading: false,

      addItemLocally: async (product, quantity) => {
        console.log('➕ addItemLocally called for:', product.name, 'quantity:', quantity);

        const currentItems = get().items;
        // Check if product already exists using productId
        const existingIndex = currentItems.findIndex(item => item.productId === product.id);

        let newItems;
        if (existingIndex !== -1) {
          // Update existing item - merge quantities
          newItems = [...currentItems];
          const newQuantity = newItems[existingIndex].quantity + quantity;
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newQuantity,
            subtotal: newItems[existingIndex].productPrice * newQuantity
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl || '',
            subtotal: product.price * quantity
          };
          newItems = [...currentItems, newItem];
        }

        set({ items: newItems });

        // ✅ AUTOMATICALLY SYNC TO BACKEND AFTER ADDING
        try {
          const user = authService.getCurrentUser();
          if (user) {
            await cartService.addToCart({ productId: product.id, quantity: quantity });
            console.log('🛒 Automatically synced to backend!');
          }
        } catch (error) {
          console.error('Failed to sync to backend:', error);
        }
      },

      updateQuantityLocally: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItemLocally(productId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity, subtotal: item.productPrice * quantity }
              : item
          )
        }));
      },

      removeItemLocally: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },

      clearCartLocally: () => {
        set({ items: [] });
      },

      syncWithBackend: async () => {
        const user = authService.getCurrentUser();
        if (!user) return;

        set({ isLoading: true });

        try {
          const freshResponse: any = await cartService.getCart();
          let freshItems: any[] = [];
          if (Array.isArray(freshResponse)) {
            freshItems = freshResponse;
          } else if (freshResponse && freshResponse.items) {
            freshItems = freshResponse.items;
          }

          const syncedItems = freshItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl || '',
            subtotal: item.productPrice * item.quantity
          }));

          set({ items: syncedItems, isLoading: false });
          console.log('🛒 Cart synced, total items:', syncedItems.length);
        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ isLoading: false });
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);