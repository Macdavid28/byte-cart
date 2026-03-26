import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import type { Coupon } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    discountPercentage: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupon/all");
      if (res.data.success) setCoupons(res.data.coupons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      type: "percentage",
      discountPercentage: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
    });
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discountPercentage: String(coupon.discountPercentage),
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
      endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        discountPercentage: Number(formData.discountPercentage),
        usageLimit: formData.usageLimit
          ? Number(formData.usageLimit)
          : undefined,
      };
      if (editingCoupon) {
        await api.put(`/coupon/${editingCoupon._id}`, payload);
        toast.success("Coupon updated!");
      } else {
        await api.post("/coupon/create", payload);
        toast.success("Coupon created!");
      }
      setShowForm(false);
      fetchCoupons();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupon/${id}`);
      toast.success("Coupon deleted!");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  if (loading) return <LoadingSpinner text="Loading coupons..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading text-xl">Coupons ({coupons.length})</h2>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-secondary font-bold text-lg">
                {editingCoupon ? "Edit Coupon" : "New Coupon"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Code
                </label>
                <input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  placeholder="SAVE20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  placeholder="Unlimited"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingCoupon
                    ? "Update Coupon"
                    : "Create Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Code
                </th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Type
                </th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Value
                </th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">
                  Dates
                </th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {coupon.code}
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">
                    {coupon.type.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {coupon.type === "percentage"
                      ? `${coupon.discountPercentage} %`
                      : `₦${coupon.discountPercentage}`}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {new Date(coupon.startDate).toLocaleDateString()} —{" "}
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(coupon)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
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

export default AdminCoupons;
