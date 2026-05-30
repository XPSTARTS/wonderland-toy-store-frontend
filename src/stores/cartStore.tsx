import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cart.service';

// Types
export interface CartItem {
  id: number;           // CartItem ID from backend
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl: string;
  subtotal: number;
}

interface CartStore {
  // State
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
  
  // Local actions (instant UI update)
  addItemLocally: (product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }, quantity: number) => void;
  
  updateQuantityLocally: (productId: number, quantity: number) => void;
  removeItemLocally: (productId: number) => void;
  clearCartLocally: () => void;
  
  // (local-first only) no backend sync
  // Computed values
  getTotalItems: () => number;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      isSyncing: false,
      lastSynced: null,

      // ========== LOCAL ACTIONS (Instant UI Update) ==========
      
      addItemLocally: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.productId === product.id);
        
        if (existingItem) {
          // Update existing item quantity
          const updatedItems = currentItems.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.productPrice }
              : item
          );
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now(), // Temporary ID, will be replaced on sync
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl,
            subtotal: product.price * quantity
          };
          set({ items: [...currentItems, newItem] });
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

      // ========== SYNC/BACKEND ACTIONS REMOVED (local-first cart) ========== 


      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);