import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import { useToast } from "../../components/Toast";
import EmptyState from "../../components/EmptyState";

const Cart = () => {
  const {
    items,
    subtotal,
    discount,
    total,
    removeFromCart,
    addToCart,
    applyCoupon,
    isLoading,
  } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <EmptyState
          title="Sign in to view your cart"
          message="Login to start adding items to your cart."
          action={
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          }
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <EmptyState
          title="Your cart is empty"
          message="Browse our products and add items to your cart."
          icon={<ShoppingBag className="h-10 w-10 text-slate-400" />}
          action={
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
          }
        />
      </div>
    );
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      toast.info("Item removed from cart");
    } else {
      // To increase: add the difference
      await addToCart(productId, 1);
    }
  };

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
    toast.info("Item removed from cart");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const message = await applyCoupon(couponCode.trim());
    toast.info(message);
    setApplyingCoupon(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 md:px-12 py-10">
        <h1 className="heading text-3xl md:text-4xl mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product}
                className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-5"
              >
                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-secondary font-bold text-slate-900 truncate">{item.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">₦{item.price.toLocaleString()} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                    disabled={isLoading}
                    className="p-2 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                    disabled={isLoading}
                    className="p-2 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-bold text-slate-900 w-24 text-right">
                  ₦{item.subtotal.toLocaleString()}
                </span>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.product)}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-100 p-6 sticky top-28">
              <h2 className="font-secondary font-bold text-lg text-slate-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">₦{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="font-semibold text-emerald-600">-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-semibold text-slate-900">Calculated at checkout</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-xl text-slate-900">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {applyingCoupon ? "..." : "Apply"}
                </button>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary py-3.5 text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="block text-center text-sm text-blue-600 font-medium mt-4 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
