import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ShoppingBag,
  Star,
  Tag,
  HelpCircle,
} from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-20">
      <div className="max-w-3xl w-full text-center">
        {/* Main 404 Visual */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-slate-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 max-w-sm mx-auto transform -rotate-2">
              <p className="text-xl font-secondary font-bold text-slate-800 mb-2">
                Oops! Page not found.
              </p>
              <p className="text-slate-600">
                The page you are looking for might have been removed or is
                temporarily unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar (Simulated) */}
        <div className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-5 pr-12 py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
          <Link
            to="/products"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingBag size={24} />
            </div>
            <span className="font-medium text-slate-700">New Arrivals</span>
          </Link>

          <Link
            to="/products"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Star size={24} />
            </div>
            <span className="font-medium text-slate-700">Best Sellers</span>
          </Link>

          <Link
            to="/products"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <Tag size={24} />
            </div>
            <span className="font-medium text-slate-700">On Sale</span>
          </Link>

          <Link
            to="/contact"
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <HelpCircle size={24} />
            </div>
            <span className="font-medium text-slate-700">Help Center</span>
          </Link>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all hover:gap-3"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
