// stores/cartStore.ts
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
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItemLocally: (product, quantity) => {
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
        if (!user) {
          return;
        }
        
        set({ isLoading: true });
        
        try {
          const localItems = get().items;
          
          if (localItems.length === 0) {
            set({ isLoading: false });
            return;
          }
          
          // First, clear backend cart completely
          try {
            await cartService.clearCart();
          } catch (error) {
            console.error('Failed to clear backend cart:', error);
          }
          
          // Then add all local items
          for (const item of localItems) {
            try {
              await cartService.addToCart({ productId: item.productId, quantity: item.quantity });
            } catch (error) {
              console.error(`Failed to sync item ${item.productName}:`, error);
            }
          }
          
          // Fetch fresh cart from backend
          const response: any = await cartService.getCart();
          
          let backendItems: any[] = [];
          if (Array.isArray(response)) {
            backendItems = response;
          } else if (response && response.items && Array.isArray(response.items)) {
            backendItems = response.items;
          }
          
          // Use Map to ensure unique productId - THIS PREVENTS DUPLICATES
          const uniqueItemsMap = new Map<number, CartItem>();
          
          for (const item of backendItems) {
            if (!uniqueItemsMap.has(item.productId)) {
              uniqueItemsMap.set(item.productId, {
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                imageUrl: item.imageUrl || '',
                subtotal: item.productPrice * item.quantity
              });
            } else {
              // If duplicate found, merge quantities
              const existing = uniqueItemsMap.get(item.productId)!;
              existing.quantity += item.quantity;
              existing.subtotal = existing.productPrice * existing.quantity;
            }
          }
          
          const syncedItems = Array.from(uniqueItemsMap.values());
          set({ items: syncedItems, isLoading: false });
          
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