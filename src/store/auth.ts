import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders?: number;
  totalSpent?: number;
}

interface AuthState {
  user: CustomerUser | null;
  status: "loading" | "authenticated" | "guest" | "error";
  init: () => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  login: (data: { email: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  setUser: (user: CustomerUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "loading",
      init: async () => {
        try {
          const res = await fetch("/api/auth/customer/me", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            set({ user: data.data.customer, status: "authenticated" });
          } else {
            set({ user: null, status: "guest" });
          }
        } catch {
          set({ user: null, status: "error" });
        }
      },
      register: async (data) => {
        try {
          const res = await fetch("/api/auth/customer/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (res.ok && json.success) {
            set({ user: json.data.customer, status: "authenticated" });
            return { ok: true };
          }
          return { ok: false, message: json.message || "Registration failed" };
        } catch {
          return { ok: false, message: "Network error. Please try again." };
        }
      },
      login: async (data) => {
        try {
          const res = await fetch("/api/auth/customer/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (res.ok && json.success) {
            set({ user: json.data.customer, status: "authenticated" });
            return { ok: true };
          }
          return { ok: false, message: json.message || "Login failed" };
        } catch {
          return { ok: false, message: "Network error. Please try again." };
        }
      },
      logout: async () => {
        try {
          await fetch("/api/auth/customer/logout", { method: "POST", credentials: "include" });
        } catch {
          // ignore
        }
        set({ user: null, status: "guest" });
      },
      setUser: (user) => set({ user, status: user ? "authenticated" : "guest" }),
    }),
    { name: "devi-pickles-customer" }
  )
);
