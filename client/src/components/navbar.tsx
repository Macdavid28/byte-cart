import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  Search,
  User,
  X,
  ChevronRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

// --- Sub-components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 group ${className}`}>
    <div className="bg-blue-600 rounded-lg p-1.5 transition-transform group-hover:scale-105">
      <span className="text-white font-bold text-xl leading-none">B</span>
    </div>
    <h1 className="font-secondary text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
      ByteCart
    </h1>
  </Link>
);

const NavLinks = ({
  links,
  isActive,
  className = "",
  itemClassName = "",
  onLinkClick,
}: {
  links: { name: string; path: string }[];
  isActive: (path: string) => boolean;
  className?: string;
  itemClassName?: string;
  onLinkClick?: () => void;
}) => (
  <div className={className}>
    {links.map((link) => {
      const active = isActive(link.path);
      return (
        <Link
          key={link.name}
          to={link.path}
          onClick={onLinkClick}
          className={`transition-all duration-300 relative group px-3 py-2 ${itemClassName} ${
            active
              ? "text-blue-600 font-semibold"
              : "text-slate-600 font-medium hover:text-blue-600"
          }`}
        >
          {link.name}
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-600 transition-all duration-300 ${active ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-75"}`}
          ></span>
        </Link>
      );
    })}
  </div>
);

const NavActions = ({
  onMenuClick,
  cartCount,
  isAuthenticated,
  isAdmin,
  userName,
  onLogout,
}: {
  onMenuClick: () => void;
  cartCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string;
  onLogout: () => void;
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={() => navigate("/products")}
        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all group"
      >
        <Search className="h-5 w-5 stroke-[1.5] group-hover:stroke-2" />
      </button>

      <Link
        to="/cart"
        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all relative group"
      >
        <ShoppingCart className="h-5 w-5 stroke-[1.5] group-hover:stroke-2" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white transform group-hover:scale-110 transition-transform">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {/* User Menu */}
      <div className="relative hidden sm:block">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all group"
            >
              <User className="h-5 w-5 stroke-[1.5] group-hover:stroke-2" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 capitalize">{userName}</p>
                    <p className="text-xs text-slate-500">{isAdmin ? "Administrator" : "Customer"}</p>
                  </div>
                  {isAdmin ? (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> My Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="hidden sm:flex p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all group"
          >
            <User className="h-5 w-5 stroke-[1.5] group-hover:stroke-2" />
          </Link>
        )}
      </div>

      <button
        className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6 stroke-[1.5]" />
      </button>
    </div>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  links,
  isActive,
  isAuthenticated,
  isAdmin,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; path: string }[];
  isActive: (path: string) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <span className="text-lg font-bold font-secondary text-slate-900">Menu</span>
          <button onClick={onClose} className="text-slate-500 hover:text-blue-600 transition-colors p-1">
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    active
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg ">{link.name}</span>
                  {active && <ChevronRight className="h-5 w-5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? "/admin" : "/dashboard"}
                onClick={onClose}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3 block text-center"
              >
                {isAdmin ? "Admin Dashboard" : "My Dashboard"}
              </Link>
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors mb-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors mb-4 block text-center"
            >
              Sign In
            </Link>
          )}
          <div className="flex justify-center text-xs text-slate-400 font-medium">
            &copy; ByteCart Mobile
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Component ---

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const { isAuthenticated, isAdmin, user, admin, logout, adminLogout, checkAuth } = useAuthStore();
  const cartItems = useCartStore((s) => s.items);

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
  ];

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (isAdmin) {
      adminLogout();
    } else {
      logout();
    }
    navigate("/");
  };

  const userName = isAdmin ? admin?.name || "Admin" : user?.name || "User";

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />

        <NavLinks
          links={links}
          isActive={isActive}
          className="hidden md:flex items-center gap-8"
          itemClassName="text-sm tracking-wide"
        />

        <NavActions
          onMenuClick={() => setIsMenuOpen(true)}
          cartCount={cartItems.length}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          userName={userName}
          onLogout={handleLogout}
        />
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={links}
        isActive={isActive}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
    </nav>
  );
};
