import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import api from "../../api/axios";
import type { Order } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-violet-100 text-violet-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-slate-100 text-slate-700",
};

const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingCourier, setTrackingCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      if (res.data.success) setOrders(res.data.orders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    try {
      await api.put(`/orders/admin/status/${selectedOrder._id}`, { status: newStatus });
      toast.success("Order status updated!");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!selectedOrder || !trackingNumber) return;
    setUpdating(true);
    try {
      await api.put(`/orders/admin/tracking/${selectedOrder._id}`, {
        courier: trackingCourier,
        trackingNumber,
      });
      toast.success("Tracking info updated!");
      fetchOrders();
    } catch {
      toast.error("Failed to update tracking");
    } finally {
      setUpdating(false);
    }
  };

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingCourier(order.tracking?.courier || "");
    setTrackingNumber(order.tracking?.trackingNumber || "");
  };

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div>
      <h2 className="heading text-xl mb-6">All Orders ({orders.length})</h2>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-secondary font-bold text-lg">{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="mb-5">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Items</h4>
              {selectedOrder.items.map((item, i) => (
                <p key={i} className="text-sm text-slate-600">
                  {item.name} × {item.quantity} — ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              ))}
              <p className="mt-2 font-bold text-slate-900">
                Total: ₦{selectedOrder.pricing.total.toLocaleString()}
              </p>
            </div>

            {/* Status Update */}
            <div className="mb-5 border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Update Status</h4>
              <div className="flex gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Tracking Update */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Tracking Info</h4>
              <div className="space-y-3">
                <input
                  value={trackingCourier}
                  onChange={(e) => setTrackingCourier(e.target.value)}
                  placeholder="Courier name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleTrackingUpdate}
                  disabled={updating || !trackingNumber}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  Save Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Order #</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Total</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Payment</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                  <td className="px-5 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-semibold">₦{order.pricing.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold capitalize ${order.payment.status === "success" ? "text-emerald-600" : "text-amber-600"}`}>
                      {order.payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openDetail(order)} className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
