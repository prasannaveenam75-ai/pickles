"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: "", slug: "", description: "", comboPrice: 0, originalPrice: 0,
    discount: 0, stock: 50, active: true, displayOrder: 0,
    items: [{ product: "", variant: "", quantity: 1 }] as any[],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [comboRes, productRes] = await Promise.all([
        fetch("/api/admin/combos"),
        fetch("/api/admin/products?limit=200"),
      ]);
      const comboData = await comboRes.json();
      const productData = await productRes.json();
      if (comboData.success) setCombos(comboData.data);
      if (productData.success) setProducts(productData.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this combo?")) return;
    await fetch(`/api/admin/combos/${id}`, { method: "DELETE" });
    setCombos(combos.filter((c) => c._id !== id));
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "", slug: "", description: "", comboPrice: 0, originalPrice: 0,
      discount: 0, stock: 50, active: true, displayOrder: 0,
      items: [{ product: "", variant: "", quantity: 1 }],
    });
    setShowForm(true);
  };

  const openEdit = (combo: any) => {
    setEditing(combo);
    setForm({
      name: combo.name, slug: combo.slug, description: combo.description || "",
      comboPrice: combo.comboPrice, originalPrice: combo.originalPrice,
      discount: combo.discount || 0, stock: combo.stock, active: combo.active !== false,
      displayOrder: combo.displayOrder || 0,
      items: combo.items?.length ? combo.items : [{ product: "", variant: "", quantity: 1 }],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, items: form.items.filter((i) => i.product) };
      if (editing) {
        await fetch(`/api/admin/combos/${editing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/combos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowForm(false);
      fetchData();
    } catch {}
    finally { setSaving(false); }
  };

  const getVariantsForProduct = (productId: string) => {
    const p = products.find((p) => p._id === productId);
    return p?.variants?.filter((v: any) => v.active) || [];
  };

  if (loading) return <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Combos</h1>
        <button onClick={openNew} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Combo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Combo" : "New Combo"}</h2>
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
              <label className="block text-sm font-medium mb-1">Combo Price (₹) *</label>
              <input type="number" value={form.comboPrice} onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })} className="admin-input" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount (%)</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="admin-input" />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Combo Items</h3>
              <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { product: "", variant: "", quantity: 1 }] })} className="text-xs text-maroon hover:underline">+ Add Item</button>
            </div>
            <div className="space-y-3">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Product</label>
                    <select value={item.product} onChange={(e) => {
                      const newItems = [...form.items];
                      newItems[idx] = { ...newItems[idx], product: e.target.value, variant: "" };
                      setForm({ ...form, items: newItems });
                    }} className="admin-input text-sm">
                      <option value="">Select product...</option>
                      {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1">Variant</label>
                    <select value={item.variant} onChange={(e) => {
                      const newItems = [...form.items];
                      newItems[idx] = { ...newItems[idx], variant: e.target.value };
                      setForm({ ...form, items: newItems });
                    }} className="admin-input text-sm" disabled={!item.product}>
                      <option value="">Select variant...</option>
                      {getVariantsForProduct(item.product).map((v: any) => (
                        <option key={v._id} value={v._id}>{v.weight} - ₹{v.price}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-medium mb-1">Qty</label>
                    <input type="number" min={1} value={item.quantity} onChange={(e) => {
                      const newItems = [...form.items];
                      newItems[idx] = { ...newItems[idx], quantity: Number(e.target.value) };
                      setForm({ ...form, items: newItems });
                    }} className="admin-input text-sm" />
                  </div>
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) })} className="p-2 text-red hover:text-red/80">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-veg" />
                Active
              </label>
              <div>
                <label className="block text-xs font-medium mb-1">Display Order</label>
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

      {combos.length === 0 ? (
        <EmptyState title="No combos" description="Create your first combo to bundle products together." />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Combo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Discount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {combos.map((combo) => (
                <tr key={combo._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-medium">{combo.name}</p>
                    <p className="text-xs text-gray-500">/{combo.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{combo.items?.length || 0} items</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-semibold">{formatPrice(combo.comboPrice)}</td>
                  <td className="px-4 py-4">
                    {combo.discount > 0 && <span className="px-2 py-0.5 bg-red/10 text-red text-xs rounded-full">{combo.discount}% OFF</span>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${combo.active ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}>
                      {combo.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(combo)} className="p-2 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(combo._id)} className="p-2 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
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