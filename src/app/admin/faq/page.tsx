"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ question: "", answer: "", displayOrder: 0, active: true });

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then((d) => { if (d.success) setFaqs(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    setFaqs(faqs.filter((f) => f._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/faq/${editing._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ question: "", answer: "", displayOrder: faqs.length, active: true });
    const res = await fetch("/api/admin/faq");
    const data = await res.json();
    if (data.success) setFaqs(data.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">FAQ</h1>
        <button onClick={() => { setEditing(null); setForm({ question: "", answer: "", displayOrder: faqs.length, active: true }); setShowForm(true); }} className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold">{editing ? "Edit FAQ" : "New FAQ"}</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Question *</label>
            <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Answer *</label>
            <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="admin-input min-h-[80px]" />
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
      ) : faqs.length === 0 ? (
        <EmptyState title="No FAQs" description="Add frequently asked questions for your customers." />
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => {
                    const next = [...faqs];
                    const idx = next.findIndex((f) => f._id === faq._id);
                    if (idx > 0) { [next[idx], next[idx-1]] = [next[idx-1], next[idx]]; setFaqs(next); }
                  }} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-green disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => {
                    const next = [...faqs];
                    const idx = next.findIndex((f) => f._id === faq._id);
                    if (idx < next.length - 1) { [next[idx], next[idx+1]] = [next[idx+1], next[idx]]; setFaqs(next); }
                  }} disabled={index === faqs.length - 1} className="p-1.5 text-gray-400 hover:text-green disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => { setEditing(faq); setForm({ question: faq.question, answer: faq.answer, displayOrder: faq.displayOrder, active: faq.active }); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-green"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(faq._id)} className="p-1.5 text-gray-400 hover:text-red"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
