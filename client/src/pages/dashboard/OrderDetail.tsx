import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import api from "../../api/axios";
import type { Order } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-violet-100 text-violet-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/my-orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch {
        // handled below
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading order..." />;
  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order not found</h2>
        <Link to="/dashboard/orders" className="text-blue-600 font-semibold hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="heading text-2xl">{order.orderNumber}</h2>
          <p className="text-sm text-slate-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${statusColors[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Package className="h-5 w-5 text-slate-700" />
              <h3 className="font-secondary font-bold text-slate-900">Order Items</h3>
            </div>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="mt-5 pt-5 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>₦{order.pricing.subtotal.toLocaleString()}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600">Discount</span>
                  <span className="text-emerald-600">-₦{order.pricing.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span>₦{order.pricing.shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-slate-200 pt-2">
                <span>Total</span>
                <span>₦{order.pricing.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          {/* Shipping */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-slate-700" />
              <h3 className="font-secondary font-bold text-slate-900">Shipping</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">{order.shipping.fullName}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.state}</p>
              <p>{order.shipping.country}</p>
              <p>{order.shipping.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-slate-700" />
              <h3 className="font-secondary font-bold text-slate-900">Payment</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Method: <span className="capitalize font-medium">{order.payment.method}</span></p>
              <p>Status: <span className={`capitalize font-semibold ${order.payment.status === "success" ? "text-emerald-600" : "text-amber-600"}`}>{order.payment.status}</span></p>
              {order.payment.reference && (
                <p className="text-xs text-slate-400 break-all">Ref: {order.payment.reference}</p>
              )}
            </div>
          </div>

          {/* Tracking */}
          {order.tracking?.trackingNumber && (
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-slate-700" />
                <h3 className="font-secondary font-bold text-slate-900">Tracking</h3>
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <p>Courier: <span className="font-medium">{order.tracking.courier}</span></p>
                <p>Tracking #: <span className="font-medium">{order.tracking.trackingNumber}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
