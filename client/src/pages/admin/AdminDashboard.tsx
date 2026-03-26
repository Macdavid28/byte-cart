import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, FolderTree, Tag, ShoppingCart, Users, Shield, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const tabs = [
  { name: "Products", path: "/admin", icon: <Package className="h-4 w-4" /> },
  { name: "Categories", path: "/admin/categories", icon: <FolderTree className="h-4 w-4" /> },
  { name: "Coupons", path: "/admin/coupons", icon: <Tag className="h-4 w-4" /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { name: "Users", path: "/admin/users", icon: <Users className="h-4 w-4" /> },
];

const AdminDashboard = () => {
  const location = useLocation();
  const admin = useAuthStore((s) => s.admin);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-secondary">Admin Dashboard</h1>
                <p className="text-slate-400 text-sm">{admin?.name || "Administrator"}</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main Site
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const isActive =
                tab.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
