import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, X, Upload } from "lucide-react";
import api from "../../api/axios";
import type { Product, Category } from "../../types";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useToast } from "../../components/Toast";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    color: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products/all"),
        api.get("/category/all"),
      ]);
      if (productsRes.data.success) setProducts(productsRes.data.products);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.categories);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", category: "", stock: "", color: "" });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: typeof product.category === "string" ? product.category : product.category._id,
      stock: String(product.stock),
      color: product.color,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("category", formData.category);
      fd.append("stock", formData.stock);
      fd.append("color", formData.color);
      if (imageFile) fd.append("coverImage", imageFile);

      if (editingProduct) {
        await api.put(`/products/update/${editingProduct._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await api.post("/products/create", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created!");
      }
      setShowForm(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteProduct) return;
    setDeletingId(confirmDeleteProduct._id);
    // Optimistic removal
    setProducts((prev) => prev.filter((p) => p._id !== confirmDeleteProduct._id));
    setConfirmDeleteProduct(null);
    try {
      await api.delete(`/products/delete/${confirmDeleteProduct._id}`);
      toast.success("Product deleted!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Delete failed");
      // Revert optimistic removal on failure
      fetchData();
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading text-xl">Products ({products.length})</h2>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-secondary font-bold text-lg">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cover Image</label>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-slate-300 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {imageFile ? imageFile.name : "Choose file..."}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-7 w-7 text-red-600" />
            </div>
            <h3 className="font-secondary font-bold text-lg text-slate-900 mb-2">Delete Product</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <strong className="text-slate-700">"{confirmDeleteProduct.name}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-secondary font-bold text-lg">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cover Image */}
            <img
              src={viewProduct.coverImage}
              alt={viewProduct.name}
              className="w-full h-56 object-cover rounded-lg bg-slate-100 mb-4"
            />

            {/* Additional Images */}
            {viewProduct.images && viewProduct.images.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {viewProduct.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${viewProduct.name} ${idx + 1}`}
                    className="w-20 h-20 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                  />
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-lg">{viewProduct.name}</h4>
                <p className="text-slate-500 text-sm mt-1">{viewProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Price</span>
                  <p className="font-bold text-slate-900 text-lg">₦{viewProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Stock</span>
                  <p className={`font-bold text-lg ${viewProduct.stock <= 5 ? "text-red-600" : "text-slate-900"}`}>
                    {viewProduct.stock}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Color</span>
                  <p className="font-medium text-slate-700 capitalize">{viewProduct.color}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Category</span>
                  <p className="font-medium text-slate-700">
                    {typeof viewProduct.category === "object" && viewProduct.category !== null
                      ? viewProduct.category.name
                      : viewProduct.category || "N/A"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                <span>Created: {new Date(viewProduct.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(viewProduct.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Product</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Price</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Stock</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Color</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.coverImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                      />
                      <span className="font-medium text-slate-900 truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900">₦{product.price.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${product.stock <= 5 ? "text-red-600" : "text-slate-700"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-600">{product.color}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        id={`view-product-${product._id}`}
                        onClick={() => setViewProduct(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        id={`edit-product-${product._id}`}
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        id={`delete-product-${product._id}`}
                        onClick={() => setConfirmDeleteProduct(product)}
                        disabled={deletingId === product._id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

export default AdminProducts;
