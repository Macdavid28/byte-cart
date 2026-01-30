import { Star, ShoppingCart } from "lucide-react";
import type { Bestsellers } from "../pages/home/Bestsellers";

const BestsellersCard = ({ name, image, price, rating }: Bestsellers) => {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-slate-100">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          alt={name}
        />

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-bold text-slate-900 shadow-lg transition-transform hover:scale-105 active:scale-95">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 truncate font-secondary text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        <div className="mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
          <span className="ml-2 text-xs text-slate-500">({rating}.0)</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          {/* Optional: Add a small action or badge here if needed */}
        </div>
      </div>
    </div>
  );
};

export default BestsellersCard;
