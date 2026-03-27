import { create } from "zustand";
import api from "../api/axios";
import type { User, Admin } from "../types";

interface AuthState {
  user: User | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setAdmin: (admin: Admin) => void;
  logout: () => void;
  adminLogout: () => void;
  checkAuth: () => Promise<void>;
  checkAdminAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: true, isAdmin: false, isLoading: false });
  },

  setAdmin: (admin) => {
    set({ admin, isAuthenticated: true, isAdmin: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/auth/v1/logout");
    } catch {
      // ignore errors on logout
    }
    set({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  adminLogout: async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // ignore errors on logout
    }
    set({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/v1/me");
      if (res.data.success && res.data.user) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          isAdmin: false,
          isLoading: false,
        });
        return;
      }
    } catch {
      // Cookie is invalid/expired — clear state silently
    }
    set({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },

  checkAdminAuth: async () => {
    try {
      const res = await api.get("/auth/v1/admin/me");
      if (res.data.success && res.data.admin) {
        set({
          admin: res.data.admin,
          isAuthenticated: true,
          isAdmin: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      // Cookie is invalid/expired — clear state silently
    }
    set({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
    });
  },
}));
