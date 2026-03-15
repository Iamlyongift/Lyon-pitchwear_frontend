import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.product._id === product._id && i.size === size && i.color === color
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i.product._id === product._id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, size, color }] });
        }
      },

      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.product._id === productId && i.size === size && i.color === color)
          ),
        });
      },

      updateQuantity: (productId, size, color, quantity) => {
        set({
          items: get().items.map((i) =>
            i.product._id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);