import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import type { Category } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/all");
      if (res.data.success) setCategories(res.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/category/${editingCategory._id}`, { name });
        toast.success("Category updated!");
      } else {
        await api.post("/category/create", { name });
        toast.success("Category created!");
      }
      setShowForm(false);
      setName("");
      setEditingCategory(null);
      fetchCategories();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/category/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <LoadingSpinner text="Loading categories..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading text-xl">Categories ({categories.length})</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setName("");
            setShowForm(true);
          }}
          className="btn-primary text-sm"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-secondary font-bold text-lg">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  placeholder="Category name"
                />
              </div>
              <button type="submit" disabled={submitting} className="w-full btn-primary py-3 disabled:opacity-50">
                {submitting ? "Saving..." : editingCategory ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-medium text-slate-900 capitalize">{cat.name}</td>
                <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setName(cat.name);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
