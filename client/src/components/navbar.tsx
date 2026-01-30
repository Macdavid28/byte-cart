import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, Search, User, X } from "lucide-react";

// --- Sub-components ---

const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 ${className}`}>
    <h1 className="font-secondary text-2xl font-bold tracking-tight text-slate-900">
      <span className="text-blue-600">Byte</span>Cart
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
    {links.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        onClick={onLinkClick}
        className={`transition-colors hover:text-blue-600 font-secondary ${itemClassName} ${
          isActive(link.path)
            ? "text-blue-600 font-bold"
            : "text-slate-600 font-medium"
        }`}
      >
        {link.name}
      </Link>
    ))}
  </div>
);

const NavActions = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <div className="flex items-center gap-4">
    <button className="text-slate-600 hover:text-blue-600 transition-colors">
      <Search className="h-5 w-5" />
    </button>
    <button className="text-slate-600 hover:text-blue-600 transition-colors relative">
      <ShoppingCart className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
        2
      </span>
    </button>
    <button className="hidden sm:flex text-slate-600 hover:text-blue-600 transition-colors">
      <User className="h-5 w-5" />
    </button>
    <button
      className="md:hidden text-slate-600 hover:text-blue-600 transition-colors"
      onClick={onMenuClick}
    >
      <Menu className="h-6 w-6" />
    </button>
  </div>
);

const MobileMenu = ({
  isOpen,
  onClose,
  links,
  isActive,
}: {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; path: string }[];
  isActive: (path: string) => boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white shadow-md md:hidden animate-in slide-in-from-top-10 fade-in duration-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100">
        <Logo />
        <button
          onClick={onClose}
          className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-12 gap-8 bg-white">
        <NavLinks
          links={links}
          isActive={isActive}
          className="flex flex-col items-center gap-8"
          itemClassName="text-2xl"
          onLinkClick={onClose}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
  ];

  // Close menu when route changes (redundant if using onLinkClick, but good safety)
  if (isMenuOpen && !location.pathname) {
    setIsMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Links */}
        <NavLinks
          links={links}
          isActive={isActive}
          className="hidden md:flex items-center gap-8"
          itemClassName="text-sm"
        />

        <NavActions onMenuClick={() => setIsMenuOpen(true)} />
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={links}
        isActive={isActive}
      />
    </nav>
  );
};
