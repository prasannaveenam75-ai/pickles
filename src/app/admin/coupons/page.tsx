"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<{
    code: string; discountType: string; discountValue: string; minimumOrderValue: string;
    maximumDiscount: string; startDate: string; endDate: string; usageLimit: string; active: boolean;
  }>({
    code: "", discountType: "percentage", discountValue: "", minimumOrderValue: "0",
    maximumDiscount: "", startDate: "", endDate: "", usageLimit: "0", active: true,
  });

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCoupons(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setCoupons(coupons.filter((c) => c._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      discountValue: parseFloat(form.discountValue),
      minimumOrderValue: parseFloat(form.minimumOrderValue as any),
      maximumDiscount: form.maximumDiscount ? parseFloat(form.maximumDiscount) : undefined,
      usageLimit: parseInt(form.usageLimit as any),
    };
    if (editing) {
      await fetch(`/api/admin/coupons/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ code: "", discountType: "percentage", discountValue: "", minimumOrderValue: "0", maximumDiscount: "", startDate: "", endDate: "", usageLimit: "0", active: true });
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    if (data.success) setCoupons(data.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Coupon" : "New Coupon"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="admin-input" placeholder="SAVE10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="admin-input">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value *</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="admin-input" placeholder={form.discountType === "percentage" ? "10" : "50"} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Order (₹)</label>
              <input type="number" value={form.minimumOrderValue} onChange={(e) => setForm({ ...form, minimumOrderValue: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
              <input type="number" value={form.maximumDiscount} onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="admin-input" placeholder="0 = unlimited" />
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
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-green" />
              Active
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="admin-btn">Save</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />)}</div>
      ) : coupons.length === 0 ? (
        <EmptyState title="No coupons" description="Create discount coupons to promote your products." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display font-bold text-xl">{c.code}</p>
                  <p className="text-xs text-gray-500">{c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                  <button onClick={() => { setEditing(c); setForm({ ...c, startDate: c.startDate?.split("T")[0] || "", endDate: c.endDate?.split("T")[0] || "" }); setShowForm(true); }} className="p-1.5 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Min order: ₹{c.minimumOrderValue}{c.maximumDiscount ? ` • Max discount: ₹${c.maximumDiscount}` : ""}</p>
                <p>Usage: {c.usedCount}/{c.usageLimit || "∞"}</p>
                <p>Valid: {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
