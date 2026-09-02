"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Snowflake } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminSeasonalPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", startDate: "", endDate: "",
    active: true, displayOrder: 0, categories: [] as string[], products: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [colRes, catRes, prodRes] = await Promise.all([
        fetch("/api/admin/seasonal"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/products?limit=200"),
      ]);
      const colData = await colRes.json();
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      if (colData.success) setCollections(colData.data);
      if (catData.success) setCategories(catData.data);
      if (prodData.success) setProducts(prodData.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this seasonal collection?")) return;
    await fetch(`/api/admin/seasonal/${id}`, { method: "DELETE" });
    setCollections(collections.filter((c) => c._id !== id));
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "", slug: "", description: "", startDate: "", endDate: "",
      active: true, displayOrder: 0, categories: [], products: [],
    });
    setShowForm(true);
  };

  const openEdit = (col: any) => {
    setEditing(col);
    setForm({
      name: col.name, slug: col.slug, description: col.description || "",
      startDate: col.startDate?.split("T")[0] || "", endDate: col.endDate?.split("T")[0] || "",
      active: col.active !== false, displayOrder: col.displayOrder || 0,
      categories: col.categories?.map((c: any) => c.toString()) || [],
      products: col.products?.map((p: any) => p.toString()) || [],
    });
    setShowForm(true);
  };

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/seasonal/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/seasonal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchData();
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) return <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seasonal Collections</h1>
        <button onClick={openNew} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Collection
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Collection" : "New Collection"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="admin-input" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setForm({ ...form, categories: toggleArrayItem(form.categories, cat._id) })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    form.categories.includes(cat._id) ? "bg-maroon text-white border-maroon" : "border-cream-dark text-charcoal-light hover:border-maroon/50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">Products</h3>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-1">
              {products.map((prod) => (
                <label key={prod._id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={form.products.includes(prod._id)}
                    onChange={() => setForm({ ...form, products: toggleArrayItem(form.products, prod._id) })}
                    className="accent-veg"
                  />
                  <span className="text-gray-500 text-xs w-16">{prod.category}</span>
                  {prod.name}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">{form.products.length} products selected</p>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-veg" />
                Active
              </label>
              <div>
                <label className="block text-xs font-medium mb-1">Order</label>
                <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className="admin-input text-sm w-20" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" disabled={saving} className="admin-btn">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <EmptyState title="No seasonal collections" description="Create a seasonal collection to group products by season or festival." />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Collection</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date Range</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categories</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{col.name}</p>
                        <p className="text-xs text-gray-500">/{col.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">
                    {col.startDate && col.endDate
                      ? `${new Date(col.startDate).toLocaleDateString()} – ${new Date(col.endDate).toLocaleDateString()}`
                      : "Open-ended"}
                  </td>
                  <td className="px-4 py-4 text-xs">{col.categories?.length || 0}</td>
                  <td className="px-4 py-4 text-xs">{col.products?.length || 0}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${col.active ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}>
                      {col.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(col)} className="p-2 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(col._id)} className="p-2 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}