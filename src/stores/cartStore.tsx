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
  isSyncing: boolean;  // ✅ Add this
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
      isSyncing: false,  // ✅ Add this initial state

      addItemLocally: (product, quantity) => {
        console.log('➕ addItemLocally called for:', product.name, 'quantity:', quantity);
        console.trace('🔍 Stack trace:');
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

        // Prevent multiple simultaneous syncs
        if (get().isSyncing) {
          console.log('🛒 Sync already in progress, skipping...');
          return;
        }

        set({ isSyncing: true, isLoading: true });

        try {
          const localItems = get().items;

          if (localItems.length === 0) {
            set({ isSyncing: false, isLoading: false });
            return;
          }

          console.log('🛒 Syncing cart with backend...');
          console.log('🛒 Local items:', localItems.length);

          // ✅ Clear backend cart first
          try {
            await cartService.clearCart();
            console.log('🛒 Cleared backend cart');
          } catch (error) {
            console.error('Failed to clear backend cart:', error);
          }

          // ✅ Add all local 
          for (const localItem of localItems) {
            await cartService.addToCart({ productId: localItem.productId, quantity: localItem.quantity });
            console.log(`🛒 Added item ${localItem.productName} x${localItem.quantity}`);
          }

          // Fetch fresh cart from backend
          const freshResponse: any = await cartService.getCart();
          let freshItems: any[] = [];
          if (Array.isArray(freshResponse)) {
            freshItems = freshResponse;
          } else if (freshResponse && freshResponse.items) {
            freshItems = freshResponse.items;
          }

          // Update local state with backend data
          const syncedItems = freshItems.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl || '',
            subtotal: item.productPrice * item.quantity
          }));

          set({ items: syncedItems, isSyncing: false, isLoading: false });
          console.log('🛒 Cart synced, total items:', syncedItems.length);

        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ isSyncing: false, isLoading: false });
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