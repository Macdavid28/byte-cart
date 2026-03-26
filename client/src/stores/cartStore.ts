import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import type { CartItem, Cart } from "../types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  isLoading: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string>;
  clearLocalCart: () => void;
  setCartFromApi: (cart: Cart) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get("/cart/get/user");
          if (res.data.success && res.data.cart) {
            const cart = res.data.cart as Cart;
            set({
              items: cart.items,
              subtotal: cart.subtotal,
              discount: cart.discount,
              total: cart.total,
              isLoading: false,
            });
          } else {
            set({ items: [], subtotal: 0, discount: 0, total: 0, isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, quantity) => {
        set({ isLoading: true });
        try {
          await api.post("/cart/add", { productId, quantity });
          // re-fetch cart to get server-calculated totals
          const res = await api.get("/cart/get/user");
          if (res.data.success && res.data.cart) {
            const cart = res.data.cart as Cart;
            set({
              items: cart.items,
              subtotal: cart.subtotal,
              discount: cart.discount,
              total: cart.total,
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        set({ isLoading: true });
        try {
          await api.delete("/cart/remove", { data: { productId } });
          const res = await api.get("/cart/get/user");
          if (res.data.success && res.data.cart) {
            const cart = res.data.cart as Cart;
            set({
              items: cart.items,
              subtotal: cart.subtotal,
              discount: cart.discount,
              total: cart.total,
            });
          } else {
            set({ items: [], subtotal: 0, discount: 0, total: 0 });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      applyCoupon: async (code) => {
        try {
          const res = await api.post("/cart/apply-coupon", { code });
          if (res.data.success) {
            // re-fetch cart
            const cartRes = await api.get("/cart/get/user");
            if (cartRes.data.success && cartRes.data.cart) {
              const cart = cartRes.data.cart as Cart;
              set({
                items: cart.items,
                subtotal: cart.subtotal,
                discount: cart.discount,
                total: cart.total,
              });
            }
            return res.data.message || "Coupon applied!";
          }
          return "Failed to apply coupon";
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } };
          return err.response?.data?.message || "Failed to apply coupon";
        }
      },

      clearLocalCart: () => {
        set({ items: [], subtotal: 0, discount: 0, total: 0 });
      },

      setCartFromApi: (cart) => {
        set({
          items: cart.items,
          subtotal: cart.subtotal,
          discount: cart.discount,
          total: cart.total,
        });
      },
    }),
    {
      name: "bytecart-cart",
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        total: state.total,
      }),
    },
  ),
);
