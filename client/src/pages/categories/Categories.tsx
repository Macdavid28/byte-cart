import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import type { Category } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

// Category icon/images — we use colored gradients since backend categories don't have images
const categoryGradients = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-indigo-500 to-indigo-600",
  "from-pink-500 to-pink-600",
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/all");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch {
        // empty state handles this
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <LoadingSpinner text="Loading categories..." />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <h1 className="heading text-3xl md:text-4xl mb-3">All Categories</h1>
          <p className="text-body max-w-lg">
            Explore our product categories and find exactly what you need.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-10">
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            message="Categories will appear here once they're added."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {category.coverImage ? (
                  <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center relative">
                    <img
                      src={category.coverImage}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                ) : (
                  <div
                    className={`h-48 bg-gradient-to-br ${categoryGradients[index % categoryGradients.length]} flex items-center justify-center`}
                  >
                    <span className="text-6xl font-bold text-white/20 uppercase select-none group-hover:scale-110 transition-transform duration-300">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="bg-white p-5 text-center">
                  <h3 className="font-secondary text-lg font-bold text-slate-800 capitalize group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm font-semibold text-blue-600 mt-1 inline-block group-hover:underline">
                    Browse Products →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
