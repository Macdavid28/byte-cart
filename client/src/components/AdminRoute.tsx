import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import LoadingSpinner from "./LoadingSpinner";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

export default AdminRoute;
