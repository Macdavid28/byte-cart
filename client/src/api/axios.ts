import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies for httpOnly JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated, isAdmin } = useAuthStore.getState();
      // Only auto-logout if user was previously authenticated
      // to avoid redirect loops on login pages
      if (isAuthenticated) {
        if (isAdmin) {
          useAuthStore.getState().adminLogout();
        } else {
          useAuthStore.getState().logout();
        }
        // Redirect to appropriate login page
        const loginPath = isAdmin ? "/admin/login" : "/login";
        if (window.location.pathname !== loginPath) {
          window.location.href = loginPath;
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
