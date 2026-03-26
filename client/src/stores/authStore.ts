import { create } from "zustand";
import api from "../api/axios";
import type { User, Admin } from "../types";

interface AuthState {
  user: User | null;
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  setAdmin: (admin: Admin, token: string) => void;
  logout: () => void;
  adminLogout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true, isAdmin: false, isLoading: false });
  },

  setAdmin: (admin, token) => {
    localStorage.setItem("token", token);
    set({ admin, token, isAuthenticated: true, isAdmin: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/auth/v1/logout");
    } catch {
      // ignore errors on logout
    }
    localStorage.removeItem("token");
    set({ user: null, admin: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false });
  },

  adminLogout: async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // ignore errors on logout
    }
    localStorage.removeItem("token");
    set({ user: null, admin: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.get("/auth/v1/check-auth");
      if (res.data.success && res.data.user) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          isAdmin: false,
          isLoading: false,
        });
      }
    } catch {
      localStorage.removeItem("token");
      set({ user: null, admin: null, token: null, isAuthenticated: false, isAdmin: false, isLoading: false });
    }
  },
}));
