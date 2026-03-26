import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";
import api from "../../api/axios";
import type { Order } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-violet-100 text-violet-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch {
        // empty state handles this
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="Your order history will appear here after your first purchase."
        icon={<Package className="h-10 w-10 text-slate-400" />}
        action={
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <h2 className="heading text-xl mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <p className="font-secondary font-bold text-slate-900">{order.orderNumber}</p>
                <p className="text-xs text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}
                >
                  {order.status}
                </span>
                <Link
                  to={`/dashboard/orders/${order._id}`}
                  className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:text-blue-700"
                >
                  <Eye className="h-4 w-4" /> View
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
              <span className="font-bold text-slate-900">₦{order.pricing.total.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
