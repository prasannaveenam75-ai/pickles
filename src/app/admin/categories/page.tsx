"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", image: "", displayOrder: 0, active: true,
    parent: "", seasonal: false, seasonalStart: "", seasonalEnd: "",
    startDate: "", endDate: "", banner: "",
  });
  const [saving, setSaving] = useState(false);
  const [expandedParent, setExpandedParent] = useState<string | null>(null);

  useEffect(() => { fetchCategories(); }, []);

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
    if (!confirm("Delete this category? Products in this category will not be deleted.")) return;
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
    setForm({
      name: "", slug: "", description: "", image: "",
      displayOrder: categories.length, active: true,
      parent: "", seasonal: false, seasonalStart: "", seasonalEnd: "",
      startDate: "", endDate: "", banner: "",
    });
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name, slug: cat.slug, description: cat.description || "",
      image: cat.image || "", displayOrder: cat.displayOrder || 0, active: cat.active !== false,
      parent: cat.parent || "", seasonal: cat.seasonal || false,
      seasonalStart: cat.seasonalStart || "", seasonalEnd: cat.seasonalEnd || "",
      startDate: cat.startDate || "", endDate: cat.endDate || "",
      banner: cat.banner || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, parent: form.parent || undefined };
      if (editing) {
        await fetch(`/api/admin/categories/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      fetchCategories();
    } catch {}
    finally { setSaving(false); }
  };

  const parentCategories = categories.filter((c) => !c.parent);
  const childCategories = (parentId: string) => categories.filter((c) => c.parent === parentId);

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
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="admin-input" placeholder="auto-generated from name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category</label>
              <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className="admin-input">
                <option value="">None (top-level)</option>
                {parentCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="admin-input" placeholder="Cloudinary URL" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Banner Image URL</label>
              <input type="text" value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} className="admin-input" placeholder="Category banner (optional)" />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Seasonal Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.seasonal} onChange={(e) => setForm({ ...form, seasonal: e.target.checked })} className="accent-veg" />
                Seasonal Category
              </label>
              <div>
                <label className="block text-xs font-medium mb-1">Seasonal Start</label>
                <input type="text" value={form.seasonalStart} onChange={(e) => setForm({ ...form, seasonalStart: e.target.value })} className="admin-input text-sm" placeholder="e.g. March" disabled={!form.seasonal} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Seasonal End</label>
                <input type="text" value={form.seasonalEnd} onChange={(e) => setForm({ ...form, seasonalEnd: e.target.value })} className="admin-input text-sm" placeholder="e.g. June" disabled={!form.seasonal} />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Date Range (optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="admin-input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="admin-input text-sm" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-veg" />
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Parent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Seasonal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parentCategories.map((cat, index) => {
                  const children = childCategories(cat._id);
                  const isExpanded = expandedParent === cat._id;
                  return (
                    <>
                      <tr key={cat._id} className="border-b hover:bg-gray-50 bg-gray-50/50">
                        <td className="px-4 py-3">
                          {children.length > 0 && (
                            <button onClick={() => setExpandedParent(isExpanded ? null : cat._id)} className="p-1 hover:text-green">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4 font-medium">{cat.name}</td>
                        <td className="px-4 py-4 text-gray-500">/{cat.slug}</td>
                        <td className="px-4 py-4 text-gray-400">—</td>
                        <td className="px-4 py-4">
                          {cat.seasonal && <span className="px-2 py-0.5 bg-golden/20 text-golden-dark text-xs rounded-full">Seasonal</span>}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1">
                            <button onClick={() => moveCategory(index, -1)} disabled={index === 0} className="p-1 hover:text-green disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                            <button onClick={() => moveCategory(index, 1)} disabled={index === categories.length - 1} className="p-1 hover:text-green disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${cat.active ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}>
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
                      {isExpanded && children.map((child) => (
                        <tr key={child._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-4 font-medium pl-10">↳ {child.name}</td>
                          <td className="px-4 py-4 text-gray-500">/{child.slug}</td>
                          <td className="px-4 py-4 text-gray-500 text-xs">{cat.name}</td>
                          <td className="px-4 py-4">
                            {child.seasonal && <span className="px-2 py-0.5 bg-golden/20 text-golden-dark text-xs rounded-full">Seasonal</span>}
                          </td>
                          <td className="px-4 py-4 text-gray-400">{child.displayOrder}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${child.active ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}>
                              {child.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(child)} className="p-2 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(child._id)} className="p-2 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}