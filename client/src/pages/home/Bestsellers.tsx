import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart, TrendingUp } from "lucide-react";
import api from "../../api/axios";
import type { Product } from "../../types";

export interface Bestsellers {
  name: string;
  image: string;
  price: number;
  rating: number;
  badge?: string;
}

// Static fallback data
const staticBestsellers: Bestsellers[] = [
  {
    name: "Sony WH-1000XM5",
    image: "https://electronics.sony.com/image/5d02da5df552836db894cebc6920215ee040f229?height=600&width=600&fit=cover",
    price: 348.0,
    rating: 5,
    badge: "Trending",
  },
  {
    name: "Nintendo Switch OLED",
    image: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch/oled-model/gallery/white/01",
    price: 349.99,
    rating: 5,
    badge: "Top Seller",
  },
  {
    name: "DJI Mini 4 Pro",
    image: "https://dji-official-aps.dji.com/cms/uploads/00f918e958197171d87e0766dd39403d.png",
    price: 759.0,
    rating: 5,
    badge: "Pro Pick",
  },
  {
    name: "Apple Vision Pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/vision-pro-gallery-1-202402?wid=600&hei=600&fmt=jpeg&qlt=95&.v=1706240428980",
    price: 3499.0,
    rating: 4,
    badge: "Futuristic",
  },
];

const badges = ["Trending", "New Release", "Staff Pick", "Best Price"];

function Bestsellers() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/all");
        if (res.data.success && res.data.products.length > 0) {
          setProducts(res.data.products.slice(0, 4));
        }
      } catch {
        // use static fallback
      }
    };
    fetchProducts();
  }, []);

  // Use API data if available, otherwise static data
  const displayItems: Bestsellers[] = products.length > 0
    ? products.map((p, idx) => ({
        name: p.name,
        image: p.coverImage,
        price: p.price,
        rating: 5,
        badge: badges[idx % badges.length],
      }))
    : staticBestsellers;

  return (
    <section className="bg-slate-950 py-20 lg:py-28 text-white relative overflow-hidden">
      {/* Subtle grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase">
              <TrendingUp className="h-3.5 w-3.5" />
              Hot Releases
            </div>
            <h2 className="font-secondary text-3xl md:text-4xl font-extrabold tracking-tight">
              Best Sellers
            </h2>
            <p className="text-slate-400 max-w-md">
              Our most popular gear, trusted by creators, professionals, and gamers worldwide.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white hover:border-slate-700 active:scale-95"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, index) => (
            <Link
              key={index}
              to={products.length > 0 ? `/products/${products[index]?._id}` : "/products"}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-slate-700/85"
            >
              {/* Image Showcase */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950/60 flex items-center justify-center p-6 border-b border-slate-800/50">
                <img
                  src={item.image}
                  className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  alt={item.name}
                  loading="lazy"
                />

                {/* Badge Overlay */}
                {item.badge && (
                  <div className="absolute top-4 left-4 rounded-md bg-blue-600/90 text-[10px] font-bold tracking-wider text-white uppercase px-2 py-0.5 shadow-md">
                    {item.badge}
                  </div>
                )}

                {/* View Product Indicator overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px]">
                  <span className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-950 shadow-xl transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    View Details
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 truncate font-secondary text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
                
                {/* Rating */}
                <div className="mb-4 flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < item.rating ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">({item.rating}.0)</span>
                </div>

                {/* Pricing */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-800/40 pt-4">
                  <span className="text-xl font-bold text-white tracking-tight">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-blue-400 group-hover:underline">
                    Shop Now &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Bestsellers;
