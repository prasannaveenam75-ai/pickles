"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ customerName: "", rating: 5, review: "", location: "", photo: "", published: true, featured: false });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews(reviews.filter((r) => r._id !== id));
  };

  const togglePublish = async (id: string, published: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    fetchReviews();
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });
    fetchReviews();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/reviews/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ customerName: "", rating: 5, review: "", location: "", photo: "", published: true, featured: false });
    fetchReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ customerName: "", rating: 5, review: "", location: "", photo: "", published: true, featured: false });
            setShowForm(true);
          }}
          className="admin-btn inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Review" : "New Review"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Review *</label>
              <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} className="admin-input min-h-[80px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo URL</label>
              <input type="text" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-green" />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-green" />
                Featured
              </label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="admin-btn">Save</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />)}</div>
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews" description="Add customer reviews that will appear on the homepage." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center font-bold text-green">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{review.customerName}</p>
                    {review.location && <p className="text-xs text-gray-500">{review.location}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-golden fill-golden" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{review.review}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex gap-2">
                  <button onClick={() => togglePublish(review._id, !review.published)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${review.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                    {review.published ? "Published" : "Draft"}
                  </button>
                  <button onClick={() => toggleFeatured(review._id, !review.featured)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${review.featured ? "bg-golden/20 text-golden-dark" : "bg-gray-100 text-gray-500"}`}>
                    {review.featured ? "Featured" : "Feature"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(review); setForm(review); setShowForm(true); }} className="p-2 text-gray-500 hover:text-green"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(review._id)} className="p-2 text-gray-500 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
