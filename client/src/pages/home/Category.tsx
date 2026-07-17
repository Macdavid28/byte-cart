import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CategoryCard from "../../components/CategoryCard";
import api from "../../api/axios";
import type { Category as CategoryType } from "../../types";

export interface Categories {
  name: string;
  image: string;
}

// Fallback images for categories
const categoryImages: Record<string, string> = {
  laptops: "https://cdn.mos.cms.futurecdn.net/Gw3Se82bvppoJsHc4rCVsQ-1200-80.jpg.webp",
  headsets: "https://dlcdnwebimgs.asus.com/gain/4BB18AEF-347E-4DB6-B78C-C0FFE1F20385/w750/h470/fwebp",
  wearables: "https://waltondigitech.com:8000/media/product_variant_image/best-smartwatch-price-in-bangladesh-walton-tick-R1A-1.png",
  phones: "https://www.concept-phones.com/wp-content/uploads/2024/12/iphone-17-pro-max-visor-camera-design-render-2-1536x1478.jpg",
};

const defaultImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400";

const Category = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/all");
        if (res.data.success) {
          setCategories(res.data.categories.slice(0, 4)); // first 4
        }
      } catch {
        // fallback to static data
      }
    };
    fetchCategories();
  }, []);

  // Map API categories to the card format with images
  const displayCategories: Categories[] = categories.length > 0
    ? categories.map((cat) => ({
        name: cat.name,
        image: cat.coverImage || categoryImages[cat.name.toLowerCase()] || defaultImage,
      }))
    : [
        { name: "laptops", image: categoryImages.laptops },
        { name: "headsets", image: categoryImages.headsets },
        { name: "wearables", image: categoryImages.wearables },
        { name: "phones", image: categoryImages.phones },
      ];

  return (
    <section className="bg-slate-50/50 py-20 lg:py-28 border-y border-slate-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Collections
            </div>
            <h2 className="heading text-3xl md:text-4xl font-extrabold tracking-tight">
              Featured Categories
            </h2>
            <p className="text-body text-slate-500 max-w-md">
              Browse our high-performance categories to find the perfect gear for your setup.
            </p>
          </div>

          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 hover:text-blue-600 hover:border-slate-300"
          >
            View All Categories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map((categoryItem, index) => (
            <CategoryCard
              key={index}
              name={categoryItem.name}
              image={categoryItem.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
