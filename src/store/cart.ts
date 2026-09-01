"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ICartItem, ICartState } from "@/types";

export const useCartStore = create<ICartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: ICartItem) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId: string, variantId: string) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },

      updateQuantity: (productId: string, variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalWeight: () => {
        return get().items.reduce((acc, item) => acc + item.weightInGrams * item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "devi-pickles-cart",
    }
  )
);
