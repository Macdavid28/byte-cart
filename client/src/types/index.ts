// ─── User ────────────────────────────────────────────
export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  isVerified: boolean;
  displayPicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  displayPicture: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ─────────────────────────────────────────
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | string;
  coverImage: string;
  images: string[];
  stock: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  coverImage: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Cart ────────────────────────────────────────────
export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
}

// ─── Order ───────────────────────────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderPricing {
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
}

export interface OrderShipping {
  fullName: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  zone?: string;
  deliveryMethod?: string;
}

export interface OrderPayment {
  method: string;
  provider?: string;
  reference?: string;
  status: "pending" | "success" | "failed";
  paidAt?: string;
}

export interface OrderTracking {
  courier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  status: OrderStatus;
  items: OrderItem[];
  pricing: OrderPricing;
  coupon?: {
    code: string;
    type: string;
    value: number;
    discountApplied: number;
  };
  shipping: OrderShipping;
  payment: OrderPayment;
  tracking: OrderTracking;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ──────────────────────────────────────────
export interface Review {
  _id: string;
  user: Pick<User, "_id" | "name" | "username" | "displayPicture">;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Coupon ──────────────────────────────────────────
export interface Coupon {
  _id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  discountPercentage: number;
  usageLimit?: number;
  userLimit?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response ────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: T | boolean | string | undefined;
}
