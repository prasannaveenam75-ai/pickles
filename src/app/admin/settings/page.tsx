"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
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
          businessName: settings.businessName,
          businessAddress: settings.businessAddress,
          phone: settings.phone,
          email: settings.email,
          fssaiNumber: settings.fssaiNumber,
          gstNumber: settings.gstNumber,
          logo: settings.logo,
          instagramUrl: settings.instagramUrl,
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
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-green" />
          </div>
          <div>
            <h2 className="font-semibold">Business Information</h2>
            <p className="text-xs text-gray-500">This information appears in the storefront.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input type="text" value={settings.businessName} onChange={(e) => updateField("businessName", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="text" value={settings.phone} onChange={(e) => updateField("phone", e.target.value)} className="admin-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={settings.email} onChange={(e) => updateField("email", e.target.value)} className="admin-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Business Address</label>
            <textarea value={settings.businessAddress} onChange={(e) => updateField("businessAddress", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FSSAI Lic. No.</label>
            <input type="text" value={settings.fssaiNumber} onChange={(e) => updateField("fssaiNumber", e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GST Number</label>
            <input type="text" value={settings.gstNumber || ""} onChange={(e) => updateField("gstNumber", e.target.value)} className="admin-input" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Logo URL</label>
            <input type="text" value={settings.logo} onChange={(e) => updateField("logo", e.target.value)} className="admin-input" placeholder="Cloudinary or image URL" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input type="url" value={settings.instagramUrl || ""} onChange={(e) => updateField("instagramUrl", e.target.value)} className="admin-input" placeholder="https://www.instagram.com/devipickles/" />
            <p className="text-xs text-gray-500 mt-1.5">Shows the "Follow Us On Instagram" button under the video testimonials. Leave empty to hide it.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
