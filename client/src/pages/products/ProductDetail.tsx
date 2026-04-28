import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus, Star, Package, Truck } from "lucide-react";
import api from "../../api/axios";
import type { Product, Review } from "../../types";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import { useToast } from "../../components/Toast";
import ReviewCard from "../../components/ReviewCard";
import ReviewForm from "../../components/ReviewForm";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  const addToCart = useCartStore((s) => s.addToCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/product/${id}`),
          api.get(`/reviews/product/${id}`),
        ]);
        if (productRes.data.success) {
          setProduct(productRes.data.product);
          setActiveImage(productRes.data.product.coverImage);
        }
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.reviews);
          setAverageRating(reviewsRes.data.averageRating || 0);
        }
      } catch {
        // handled by empty state
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating || 0);
      }
    } catch {
      // ignore
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login to add items to cart");
      return;
    }
    if (isAdmin) {
      toast.warning("Admins cannot add items to cart. Please log in as a user.");
      return;
    }
    if (!product) return;
    try {
      await addToCart(product._id, quantity);
      toast.success(`${product.name} (x${quantity}) added to cart!`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product not found</h2>
          <Link to="/products" className="text-blue-600 font-semibold hover:underline">
            ← Browse products
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.coverImage, ...(product.images || [])];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 py-8">
        {/* Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === img ? "border-blue-600" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold font-secondary text-slate-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {averageRating > 0 ? `${averageRating} / 5` : "No ratings yet"} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-slate-900 mb-6">
              ₦{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <Package className="h-4 w-4" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
              <span className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full capitalize">
                Color: {product.color}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <Truck className="h-4 w-4" />
                Free shipping
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-slate-200 pt-12">
          <h2 className="heading text-2xl md:text-3xl mb-8">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              {isAuthenticated ? (
                <ReviewForm productId={product._id} onReviewAdded={fetchReviews} />
              ) : (
                <div className="border border-slate-100 rounded-xl p-5 bg-slate-50 text-center">
                  <p className="text-slate-500 text-sm mb-3">Login to write a review</p>
                  <Link to="/login" className="btn-primary text-sm px-5 py-2">
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => <ReviewCard key={review._id} review={review} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
