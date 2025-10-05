import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from './api';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (cart: any) => void;
  syncWithServer: () => Promise<void>;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

interface WishlistStore {
  items: string[]; // Array of product IDs
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isLoggedIn: false,
      
      addItem: async (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.product._id === item.product._id);
        
        if (existingItem) {
          const updatedItems = items.map(i =>
            i.product._id === item.product._id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...items, item] });
        }
        
        // Recalculate totals
        const newItems = get().items;
        set({
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });

        // Sync with server if logged in
        if (get().isLoggedIn) {
          try {
            await cartAPI.addToCart({
              productId: item.product._id,
              quantity: item.quantity
            });
          } catch (error) {
            console.error('Failed to sync cart with server:', error);
          }
        }
      },
      
      removeItem: (itemId) => {
        const items = get().items.filter(item => item._id !== itemId);
        set({
          items,
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        const items = get().items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        );
        
        set({
          items,
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
      
      setCart: (cart) => {
        set({
          items: cart.items || [],
          totalItems: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0
        });
      },

      setIsLoggedIn: (loggedIn) => {
        set({ isLoggedIn: loggedIn });
      },

      syncWithServer: async () => {
        if (!get().isLoggedIn) return;
        
        try {
          const response = await cartAPI.getCart();
          const serverCart = response.data.data.cart;
          set({
            items: serverCart.items || [],
            totalItems: serverCart.totalItems || 0,
            totalPrice: serverCart.totalPrice || 0
          });
        } catch (error) {
          console.error('Failed to sync cart with server:', error);
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (productId) => {
        const items = get().items;
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      
      removeFromWishlist: (productId) => {
        const items = get().items.filter(id => id !== productId);
        set({ items });
      },
      
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
