import { Link, Outlet, useLocation } from "react-router-dom";
import { User, Package } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const tabs = [
  { name: "Profile", path: "/dashboard", icon: <User className="h-4 w-4" /> },
  { name: "Orders", path: "/dashboard/orders", icon: <Package className="h-4 w-4" /> },
];

const Dashboard = () => {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.displayPicture ? (
                <img src={user.displayPicture} className="w-14 h-14 rounded-full object-cover" alt="" />
              ) : (
                <User className="h-7 w-7 text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-secondary text-slate-900 capitalize">
                {user?.name || "My Dashboard"}
              </h1>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive =
                tab.path === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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

export default Dashboard;
