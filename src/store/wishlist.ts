import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const exists = get().items.some((i) => i.productId === productId);
        set({
          items: exists
            ? get().items.filter((i) => i.productId !== productId)
            : [...get().items, { productId }],
        });
      },
      has: (productId) => get().items.some((i) => i.productId === productId),
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "devi-pickles-wishlist" }
  )
);
