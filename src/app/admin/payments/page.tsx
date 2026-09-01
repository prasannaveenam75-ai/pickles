"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

export default function AdminPaymentsPage() {
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
        body: JSON.stringify({
          razorpayEnabled: settings.razorpayEnabled,
          whatsappOrdersEnabled: settings.whatsappOrdersEnabled,
        }),
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
        <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-green" />
          </div>
          <div>
            <h2 className="font-semibold">Payment Methods</h2>
            <p className="text-xs text-gray-500">Enable or disable payment options for customers.</p>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Razorpay</p>
            <p className="text-xs text-gray-500">Online card/UPI/netbanking payments</p>
          </div>
          <input
            type="checkbox"
            checked={settings.razorpayEnabled}
            onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
            className="accent-green w-6 h-6"
          />
        </div>

        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">WhatsApp Orders</p>
            <p className="text-xs text-gray-500">Customers can order via WhatsApp with prefilled message</p>
          </div>
          <input
            type="checkbox"
            checked={settings.whatsappOrdersEnabled}
            onChange={(e) => setSettings({ ...settings, whatsappOrdersEnabled: e.target.checked })}
            className="accent-green w-6 h-6"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">Security Note</p>
          Razorpay API keys are stored as environment variables and are never exposed to the browser. Secret key is only used server-side.
        </div>
      </div>
    </div>
  );
}
