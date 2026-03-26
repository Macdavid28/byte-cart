import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import api from "../../api/axios";
import type { Product, Category } from "../../types";
import ProductCard from "../../components/ProductCard";
import FilterSidebar from "../../components/FilterSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/category/all"),
        ]);
        if (productsRes.data.success) setProducts(productsRes.data.products);
        if (categoriesRes.data.success) setCategories(categoriesRes.data.categories);
      } catch {
        // errors handled silently — empty state shows
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.color.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Category filter
      if (selectedCategory) {
        const productCategoryId =
          typeof product.category === "string" ? product.category : product.category?._id;
        if (productCategoryId !== selectedCategory) return false;
      }
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      // Rating filter (placeholder — products don't have rating field, but we keep the filter for future use)
      if (minRating > 0) {
        // skip for now since products don't have an average rating field
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory, priceRange, minRating]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 1000000]);
    setMinRating(0);
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <h1 className="heading text-3xl md:text-4xl mb-3">All Products</h1>
          <p className="text-body max-w-lg">
            Browse our complete collection of premium tech products.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, description, or color..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            onClearFilters={clearFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              {/* Mobile Filter Toggle is inside FilterSidebar */}
              <div className="lg:hidden">
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products found"
                message="Try adjusting your search or filters to find what you're looking for."
                action={
                  <button onClick={clearFilters} className="btn-primary text-sm">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
