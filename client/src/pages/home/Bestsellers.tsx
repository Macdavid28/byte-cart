import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import api from "../../api/axios";
import type { Product } from "../../types";

export interface Bestsellers {
  name: string;
  image: string;
  price: number;
  rating: number;
}

// Static fallback data
const staticBestsellers: Bestsellers[] = [
  {
    name: "Sony WH-1000XM5",
    image: "https://electronics.sony.com/image/5d02da5df552836db894cebc6920215ee040f229?height=600&width=600&fit=cover",
    price: 348.0,
    rating: 5,
  },
  {
    name: "Nintendo Switch OLED",
    image: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch/oled-model/gallery/white/01",
    price: 349.99,
    rating: 5,
  },
  {
    name: "DJI Mini 4 Pro",
    image: "https://dji-official-aps.dji.com/cms/uploads/00f918e958197171d87e0766dd39403d.png",
    price: 759.0,
    rating: 5,
  },
  {
    name: "Apple Vision Pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/vision-pro-gallery-1-202402?wid=600&hei=600&fmt=jpeg&qlt=95&.v=1706240428980",
    price: 3499.0,
    rating: 4,
  },
];

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
    ? products.map((p) => ({
        name: p.name,
        image: p.coverImage,
        price: p.price,
        rating: 5,
      }))
    : staticBestsellers;

  return (
    <section className="bg-slate-900 py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="font-secondary text-3xl font-bold text-white md:text-4xl">
              Bestsellers
            </h2>
            <p className="text-gray-400 max-w-md">
              Our most popular gear, trusted by pros and gamers worldwide.
            </p>
          </div>

          <Link
            to="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-white"
          >
            View All Products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, index) => (
            <Link
              key={index}
              to={products.length > 0 ? `/products/${products[index]?._id}` : "/products"}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-slate-100"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  alt={item.name}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-bold text-slate-900 shadow-lg">
                    <ShoppingCart className="h-4 w-4" />
                    View Product
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 truncate font-secondary text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < item.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-slate-500">({item.rating}.0)</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">
                    ₦{item.price.toLocaleString()}
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
