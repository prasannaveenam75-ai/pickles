"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Star, Play, Upload, Eye, Sparkles,
} from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";
import EmptyState from "@/components/ui/EmptyState";
import TestimonialQuoteCard from "@/components/ui/TestimonialQuoteCard";
import TestimonialVideoModal from "@/components/ui/TestimonialVideoModal";
import { TESTIMONIAL_TYPE_LABELS } from "@/lib/utils/testimonial";

const INSTAGRAM_URL_RE = /^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\/[A-Za-z0-9_-]+\/?(\?.*)?$/;
const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const TABS = [
  { key: "all", label: "All" },
  { key: "written", label: "Written" },
  { key: "instagram", label: "Instagram Videos" },
  { key: "uploaded", label: "Uploaded Videos" },
  { key: "featured", label: "Featured" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

function defaultForm() {
  return {
    type: "written" as "written" | "instagram" | "uploaded",
    customerName: "",
    customerLocation: "",
    customerImage: "",
    productId: "",
    rating: 5,
    reviewText: "",
    instagramUrl: "",
    videoUrl: "",
    thumbnailUrl: "",
    caption: "",
    verified: false,
    featured: false,
    active: true,
    displayOrder: 0,
  };
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(defaultForm());
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((d) => { if (d.success) setItems(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.data || []); })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (tab === "written") return t.type === "written";
      if (tab === "instagram") return t.type === "instagram";
      if (tab === "uploaded") return t.type === "uploaded";
      if (tab === "featured") return t.featured;
      if (tab === "active") return t.active;
      if (tab === "inactive") return !t.active;
      return true;
    });
  }, [items, tab]);

  const openNew = () => {
    setEditing(null);
    setForm(defaultForm());
    setError("");
    setShowForm(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ ...defaultForm(), ...t });
    setError("");
    setShowForm(true);
  };

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const quickPut = async (id: string, body: any) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setItems((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...body } : t))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems(items.filter((t) => t._id !== id));
  };

  const handleUpload = async (file: File) => {
    if (!VIDEO_TYPES.has(file.type)) {
      setError("Please upload an MP4, MOV or WebM video.");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError("Video is too large. Maximum allowed size is 100 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/testimonials/upload-video", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setForm({
          ...form,
          videoUrl: data.data.videoUrl,
          thumbnailUrl: data.data.thumbnailUrl,
          videoDuration: data.data.videoDuration,
          videoAspect: data.data.videoAspect,
        });
      } else {
        setError(data.message || "Video upload failed.");
      }
    } catch {
      setError("Video upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim()) return setError("Customer name is required.");

    const payload: any = {
      type: form.type,
      customerName: form.customerName.trim(),
      customerLocation: form.customerLocation,
      customerImage: form.customerImage,
      productId: form.productId,
      rating: Number(form.rating) || 5,
      reviewText: form.reviewText,
      caption: form.caption,
      verified: form.verified,
      featured: form.featured,
      active: form.active,
      displayOrder: Number(form.displayOrder) || 0,
    };

    if (form.type === "written") {
      if (!form.reviewText.trim()) return setError("Review text is required for written testimonials.");
    } else if (form.type === "instagram") {
      if (!INSTAGRAM_URL_RE.test(form.instagramUrl.trim())) {
        return setError("Please enter a valid Instagram post or Reel URL.");
      }
      payload.instagramUrl = form.instagramUrl.trim();
    } else {
      if (!form.videoUrl.trim()) return setError("A video is required. Upload a file or paste a video URL.");
      payload.videoUrl = form.videoUrl.trim();
      payload.thumbnailUrl = form.thumbnailUrl.trim();
      if (form.videoDuration !== undefined) payload.videoDuration = form.videoDuration;
      if (form.videoAspect) payload.videoAspect = form.videoAspect;
    }

    setSaving(true);
    try {
      const res = editing
        ? await fetch(`/api/admin/testimonials/${editing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to save testimonial.");
        return;
      }
      setShowForm(false);
      setEditing(null);
      const refreshed = await fetch("/api/admin/testimonials");
      const r = await refreshed.json();
      if (r.success) setItems(r.data);
    } finally {
      setSaving(false);
    }
  };

  const typeBadge = (t: any) => {
    const base = "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full";
    if (t.type === "instagram")
      return <span className={`${base} bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white`}><InstagramIcon className="w-3 h-3" />Instagram Testimonial</span>;
    if (t.type === "uploaded")
      return <span className={`${base} bg-blue-100 text-blue-800`}><Play className="w-3 h-3" />Uploaded Video</span>;
    return <span className={`${base} bg-green-100 text-green-800`}>{TESTIMONIAL_TYPE_LABELS.written}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={openNew} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "bg-green text-white" : "bg-white border text-gray-600 hover:text-green"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className="admin-input">
                <option value="written">Written</option>
                <option value="instagram">Instagram Video (Reel/Post URL)</option>
                <option value="uploaded">Uploaded Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name *</label>
              <input type="text" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input type="text" value={form.customerLocation} onChange={(e) => update("customerLocation", e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select value={form.productId} onChange={(e) => update("productId", e.target.value)} className="admin-input">
                <option value="">None / General</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={form.rating} onChange={(e) => update("rating", parseInt(e.target.value) || 5)} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Order</label>
              <input type="number" value={form.displayOrder} onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)} className="admin-input" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">Customer Photo URL</label>
              <input type="text" value={form.customerImage} onChange={(e) => update("customerImage", e.target.value)} className="admin-input" placeholder="Optional (leave empty for initials)" />
            </div>
          </div>

          {form.type === "written" && (
            <div>
              <label className="block text-sm font-medium mb-1">Review Text *</label>
              <textarea value={form.reviewText} onChange={(e) => update("reviewText", e.target.value)} className="admin-input min-h-[100px]" placeholder="What did the customer say?" />
            </div>
          )}

          {form.type === "instagram" && (
            <div>
              <label className="block text-sm font-medium mb-1">Instagram Reel / Post URL *</label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) => update("instagramUrl", e.target.value)}
                className="admin-input"
                placeholder="https://www.instagram.com/reel/ABC123/"
              />
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <InstagramIcon className="w-3 h-3" /> Example: https://www.instagram.com/reel/CxYzAbC/ or /p/ or /tv/
              </p>
            </div>
          )}

          {form.type === "uploaded" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Upload Video (MP4, MOV or WebM, max 100 MB)</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-green file:text-white file:text-sm file:font-medium hover:file:bg-green-light"
                />
                {uploading && <p className="text-xs text-green mt-1.5 flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-green border-t-transparent rounded-full animate-spin inline-block" />Uploading video…</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Video URL *</label>
                  <input type="url" value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} className="admin-input" placeholder="Cloudinary video URL (auto-filled after upload)" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                  <input type="url" value={form.thumbnailUrl} onChange={(e) => update("thumbnailUrl", e.target.value)} className="admin-input" placeholder="Auto-filled after upload" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1"><Upload className="w-3.5 h-3.5" />
                  {form.videoDuration ? `${Math.round(form.videoDuration)}s` : "Duration: —"}
                </span>
                <span>Aspect: {form.videoAspect || "—"}</span>
              </div>
            </div>
          )}

          {form.type !== "written" && (
            <div>
              <label className="block text-sm font-medium mb-1">Caption</label>
              <textarea value={form.caption} onChange={(e) => update("caption", e.target.value)} className="admin-input min-h-[80px]" placeholder="Shown on the video card under the customer name (e.g. what they said about the pickle)." />
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-5 flex-wrap">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} className="accent-green" /> Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-green" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.verified} onChange={(e) => update("verified", e.target.checked)} className="accent-green" /> Verified Customer
              </label>
            </div>
            <button type="submit" disabled={saving} className="admin-btn">
              {saving ? "Saving…" : "Save Testimonial"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red bg-red/5 border border-red/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No testimonials" description="Add written testimonials, Instagram Reels or uploaded videos to power the storefront sections." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t._id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start gap-4">
                {t.type === "written" ? (
                  t.customerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.customerImage} alt={t.customerName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green/10 text-green flex items-center justify-center font-bold text-lg">
                      {t.customerName.charAt(0)}
                    </div>
                  )
                ) : (
                  <div
                    className="w-12 h-12 rounded-lg bg-charcoal-dark bg-cover bg-center flex-shrink-0"
                    style={t.thumbnailUrl ? { backgroundImage: `url(${t.thumbnailUrl})` } : undefined}
                  >
                    <div className="w-full h-full rounded-lg bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 truncate">{t.customerName}</p>
                    {t.isDemo && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-golden-dark bg-golden/15 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />Sample
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{t.customerLocation || "—"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-golden fill-golden" : "text-gray-300"}`} />
                      ))}
                    </span>
                    {t.productName && <span className="text-[11px] text-green font-medium">{t.productName}</span>}
                  </div>
                </div>
                <div>{typeBadge(t)}</div>
              </div>

              {t.type === "written" && t.reviewText && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{t.reviewText}</p>
              )}
              {t.type !== "written" && t.caption && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{t.caption}</p>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t flex-wrap gap-2">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => quickPut(t._id, { active: !t.active })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${t.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                  >
                    {t.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => quickPut(t._id, { featured: !t.featured })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${t.featured ? "bg-golden/20 text-golden-dark" : "bg-gray-100 text-gray-500"}`}
                  >
                    {t.featured ? "Featured" : "Feature"}
                  </button>
                  <button
                    onClick={() => quickPut(t._id, { verified: !t.verified })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium ${t.verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                  >
                    {t.verified ? "Verified" : "Not Verified"}
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setPreview(t)} className="p-2 text-gray-500 hover:text-green" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(t)} className="p-2 text-gray-500 hover:text-green" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-500 hover:text-red" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Order: {t.displayOrder} · {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}

      {preview && preview.type === "written" && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={() => setPreview(null)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <TestimonialQuoteCard testimonial={preview} clamp={false} />
            <button onClick={() => setPreview(null)} className="mt-4 w-full bg-white text-charcoal-dark font-semibold text-sm py-2.5 rounded-lg">Close Preview</button>
          </div>
        </div>
      )}

      <TestimonialVideoModal testimonial={preview && preview.type !== "written" ? preview : null} onClose={() => setPreview(null)} />
    </div>
  );
}