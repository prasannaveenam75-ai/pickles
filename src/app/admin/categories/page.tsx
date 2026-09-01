"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "", displayOrder: 0, active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories(categories.filter((c) => c._id !== id));
  };

  const moveCategory = async (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const newList = [...categories];
    const curr = newList[index];
    newList[index] = { ...newList[newIndex], displayOrder: newList[index].displayOrder };
    newList[newIndex] = { ...curr, displayOrder: curr.displayOrder };
    setCategories(newList);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image: "", displayOrder: categories.length, active: true });
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image, displayOrder: cat.displayOrder, active: cat.active });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/categories/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchCategories();
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={openNew} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Category" : "New Category"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="admin-input" placeholder="Cloudinary URL" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} className="admin-input" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-green" />
              Active
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" disabled={saving} className="admin-btn">{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <EmptyState title="No categories" description="Create your first category to organize products." />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">{cat.name}</td>
                    <td className="px-4 py-4 text-gray-500">/{cat.slug}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => moveCategory(index, -1)} disabled={index === 0} className="p-1 hover:text-green disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                        <button onClick={() => moveCategory(index, 1)} disabled={index === categories.length - 1} className="p-1 hover:text-green disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${cat.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(cat)} className="p-2 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(cat._id)} className="p-2 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
