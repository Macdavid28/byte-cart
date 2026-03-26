import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "../types";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useToast } from "./Toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((s) => s.addToCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warning("Please login to add items to cart");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-slate-100"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.coverImage}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          alt={product.name}
        />

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-bold text-slate-900 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 truncate font-secondary text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.description}</p>

        <div className="mb-3 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            ₦{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 capitalize px-2 py-1 bg-slate-100 rounded-full">
            {product.color}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
