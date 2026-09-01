"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

export default function AdminDeliveryPage() {
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

  const updateField = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryRatePerKg: parseFloat(settings.deliveryRatePerKg),
          minimumDeliveryCharge: parseFloat(settings.minimumDeliveryCharge),
          freeDeliveryEnabled: settings.freeDeliveryEnabled,
          freeDeliveryThreshold: parseFloat(settings.freeDeliveryThreshold),
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

  const rate = parseFloat(settings?.deliveryRatePerKg) || 100;
  const minCharge = parseFloat(settings?.minimumDeliveryCharge) || 100;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Settings</h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-green" />
          </div>
          <div>
            <h2 className="font-semibold">Delivery Rates</h2>
            <p className="text-xs text-gray-500">Charges calculated based on total order weight.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rate per kg (₹)</label>
            <input type="number" value={settings.deliveryRatePerKg} onChange={(e) => updateField("deliveryRatePerKg", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Delivery Charge (₹)</label>
            <input type="number" value={settings.minimumDeliveryCharge} onChange={(e) => updateField("minimumDeliveryCharge", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Free Delivery Threshold (₹)</label>
            <input type="number" value={settings.freeDeliveryThreshold} onChange={(e) => updateField("freeDeliveryThreshold", e.target.value)} className="admin-input" />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings.freeDeliveryEnabled} onChange={(e) => updateField("freeDeliveryEnabled", e.target.checked)} className="accent-green" />
              Enable Free Delivery
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-4">Preview Calculation</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "500g (0.5kg)", weight: 0.5 },
            { label: "1kg", weight: 1 },
            { label: "1.5kg", weight: 1.5 },
            { label: "2kg", weight: 2 },
          ].map((item) => {
            let charge = Math.ceil(item.weight) * rate;
            charge = Math.max(charge, minCharge);
            return (
              <div key={item.label} className="flex justify-between border-b pb-2">
                <span>{item.label}</span>
                <span className="font-semibold">₹{charge}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
