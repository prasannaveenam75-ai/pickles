"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function AdminWhatsAppPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: settings.whatsappNumber }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="h-24 bg-gray-200 rounded animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Settings</h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green" />
          </div>
          <div>
            <h2 className="font-semibold">WhatsApp Number</h2>
            <p className="text-xs text-gray-500">This number receives all order messages.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp Number (with country code, no +)</label>
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
            className="admin-input"
            placeholder="919999999999"
          />
          <p className="text-xs text-gray-500 mt-1">Example: 91 followed by 10-digit number</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500">
            Customers can place orders by clicking "Order on WhatsApp". The system generates a prefilled message with their cart items, weights, prices and total.
          </p>
        </div>
      </div>
    </div>
  );
}
