import { Link } from "react-router-dom";
import type { Categories } from "../pages/home/Category";
import { ArrowUpRight } from "lucide-react";

const CategoryCard = ({ name, image }: Categories) => {
  return (
    <Link
      to={`/products?category=${name}`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-slate-200"
    >
      <div className="relative h-56 w-full overflow-hidden bg-slate-50">
        <img
          src={image}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          alt={name}
          loading="lazy"
        />
        {/* Dark subtle overlay that shifts on hover */}
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/5 transition-colors duration-500" />
        
        {/* Hover Arrow Icon */}
        <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm p-2 text-slate-800 opacity-0 scale-75 translate-x-2 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 shadow-md">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="p-5 flex items-center justify-between">
        <div>
          <h3 className="font-secondary text-lg font-bold text-slate-800 capitalize tracking-tight group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Explore Category</p>
        </div>
        
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
          Shop &rarr;
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
