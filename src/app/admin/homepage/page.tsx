"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminHomepagePage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [hero, setHero] = useState({
    heading: "", subheading: "", badge: "", image: "", imageMobile: "", videoUrl: "", videoUrlMobile: "", ctaText: "", ctaUrl: "",
  });
  const [announcement, setAnnouncement] = useState({ text: "", active: true });
  const [story, setStory] = useState({ title: "", text: "", image: "" });
  const [finalCta, setFinalCta] = useState({ heading: "", description: "", buttonText: "", buttonUrl: "" });
  const [socialGallery, setSocialGallery] = useState<string[]>([]);
  const [trustItems, setTrustItems] = useState<{icon: string; title: string; description: string}[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);
  const [founder, setFounder] = useState({ name: "", designation: "", story: "", quote: "", image: "" });
  const [policies, setPolicies] = useState({
    heading: "", unboxingDisclaimer: "", cancellationHeading: "", cancellationText: "",
    returnHeading: "", returnText: "", refundHeading: "", refundText: "", policyNote: "",
  });
  const [whyChooseUs, setWhyChooseUs] = useState<{title: string; items: {title: string; description: string; icon: string}[]}>({ title: "", items: [] });

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const c = d.data;
          setContent(c);
          setHero({ heading: "", subheading: "", badge: "", image: "", imageMobile: "", videoUrl: "", videoUrlMobile: "", ctaText: "", ctaUrl: "", ...(c.hero || {}) });
          setAnnouncement(c.announcementBar || { text: "", active: true });
          setStory(c.storySection || { title: "", text: "", image: "" });
          setFinalCta(c.finalCta || { heading: "", description: "", buttonText: "", buttonUrl: "" });
          setSocialGallery(c.socialGallery || []);
          setTrustItems(c.trustItems || []);
          setFeaturedProducts(c.featuredProducts || []);
          setFounder(c.founder || { name: "", designation: "", story: "", quote: "", image: "" });
          setPolicies({ heading: "", unboxingDisclaimer: "", cancellationHeading: "", cancellationText: "", returnHeading: "", returnText: "", refundHeading: "", refundText: "", policyNote: "", ...(c.policies || {}) });
          setWhyChooseUs(c.whyChooseUs || { title: "", items: [] });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero,
          announcementBar: announcement,
          storySection: story,
          finalCta,
          socialGallery,
          trustItems,
          featuredProducts,
          founder,
          policies,
          whyChooseUs,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn">
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-lg">Announcement Bar</h2>
          <div className="grid grid-cols-1 gap-3">
            <input type="text" value={announcement.text} onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })} className="admin-input" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={announcement.active} onChange={(e) => setAnnouncement({ ...announcement, active: e.target.checked })} className="accent-green" />
            Active
          </label>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Small Badge</label>
            <input type="text" value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} className="admin-input" placeholder="PURE. FRESH. HOMEMADE WITH LOVE." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <textarea value={hero.heading} onChange={(e) => setHero({ ...hero, heading: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subheading</label>
            <textarea value={hero.subheading} onChange={(e) => setHero({ ...hero, subheading: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Desktop Image URL</label>
            <input type="text" value={hero.image} onChange={(e) => setHero({ ...hero, image: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Image URL</label>
            <input type="text" value={hero.imageMobile} onChange={(e) => setHero({ ...hero, imageMobile: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Desktop Video URL (optional)</label>
            <input type="text" value={hero.videoUrl} onChange={(e) => setHero({ ...hero, videoUrl: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Video URL (optional)</label>
            <input type="text" value={hero.videoUrlMobile} onChange={(e) => setHero({ ...hero, videoUrlMobile: e.target.value })} className="admin-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <input type="text" value={hero.ctaText} onChange={(e) => setHero({ ...hero, ctaText: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CTA URL</label>
              <input type="text" value={hero.ctaUrl} onChange={(e) => setHero({ ...hero, ctaUrl: e.target.value })} className="admin-input" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg">Story Section</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={story.title} onChange={(e) => setStory({ ...story, title: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <textarea value={story.text} onChange={(e) => setStory({ ...story, text: e.target.value })} className="admin-input min-h-[80px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="text" value={story.image} onChange={(e) => setStory({ ...story, image: e.target.value })} className="admin-input" />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg">Final CTA</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <input type="text" value={finalCta.heading} onChange={(e) => setFinalCta({ ...finalCta, heading: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={finalCta.description} onChange={(e) => setFinalCta({ ...finalCta, description: e.target.value })} className="admin-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <input type="text" value={finalCta.buttonText} onChange={(e) => setFinalCta({ ...finalCta, buttonText: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button URL</label>
              <input type="text" value={finalCta.buttonUrl} onChange={(e) => setFinalCta({ ...finalCta, buttonUrl: e.target.value })} className="admin-input" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg">Trust Items</h2>
          <div className="space-y-3">
            {trustItems.map((item, i) => (
              <div key={i} className="border rounded-lg p-3 grid grid-cols-3 gap-2">
                <input type="text" value={item.icon} onChange={(e) => updateTrustItem(i, "icon", e.target.value)} className="admin-input" placeholder="Icon" />
                <input type="text" value={item.title} onChange={(e) => updateTrustItem(i, "title", e.target.value)} className="admin-input" placeholder="Title" />
                <input type="text" value={item.description} onChange={(e) => updateTrustItem(i, "description", e.target.value)} className="admin-input" placeholder="Description" />
              </div>
            ))}
          </div>
          <button onClick={() => setTrustItems([...trustItems, { icon: "leaf", title: "", description: "" }])} className="text-sm text-green font-medium">+ Add Trust Item</button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-lg">Social Gallery</h2>
          <div className="space-y-2">
            {socialGallery.map((img, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={img} onChange={(e) => { const next = [...socialGallery]; next[i] = e.target.value; setSocialGallery(next); }} className="admin-input" />
                <button onClick={() => setSocialGallery(socialGallery.filter((_, x) => x !== i))} className="p-2 text-red flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setSocialGallery([...socialGallery, ""])} className="text-sm text-green font-medium">+ Add Image URL</button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-lg">Why Choose Devi Pickles (Trust Elements)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={whyChooseUs.title} onChange={(e) => setWhyChooseUs({ ...whyChooseUs, title: e.target.value })} className="admin-input" /></div>
          </div>
          <div className="space-y-3">
            {whyChooseUs.items.map((item, i) => (
              <div key={i} className="border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input type="text" value={item.icon} onChange={(e) => updateWhyItem(i, "icon", e.target.value)} className="admin-input" placeholder="Icon (leaf/shield/book/star/home/zap)" />
                <input type="text" value={item.title} onChange={(e) => updateWhyItem(i, "title", e.target.value)} className="admin-input sm:col-span-1" placeholder="Title" />
                <input type="text" value={item.description} onChange={(e) => updateWhyItem(i, "description", e.target.value)} className="admin-input sm:col-span-2" placeholder="Description" />
              </div>
            ))}
          </div>
          <button onClick={() => setWhyChooseUs({ ...whyChooseUs, items: [...whyChooseUs.items, { icon: "leaf", title: "", description: "" }] })} className="text-sm text-green font-medium">+ Add Trust Card</button>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-lg">Founder Section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={founder.name} onChange={(e) => setFounder({ ...founder, name: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Designation</label><input type="text" value={founder.designation} onChange={(e) => setFounder({ ...founder, designation: e.target.value })} className="admin-input" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Story</label><textarea value={founder.story} onChange={(e) => setFounder({ ...founder, story: e.target.value })} className="admin-input min-h-[100px]" /></div>
          <div><label className="block text-sm font-medium mb-1">Quote</label><input type="text" value={founder.quote} onChange={(e) => setFounder({ ...founder, quote: e.target.value })} className="admin-input" /></div>
          <div><label className="block text-sm font-medium mb-1">Founder Image URL</label><input type="text" value={founder.image} onChange={(e) => setFounder({ ...founder, image: e.target.value })} className="admin-input" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-lg">Order Policy &amp; Unboxing Disclaimer</h2>
          <div><label className="block text-sm font-medium mb-1">Section Heading</label><input type="text" value={policies.heading} onChange={(e) => setPolicies({ ...policies, heading: e.target.value })} className="admin-input" /></div>
          <div><label className="block text-sm font-medium mb-1">Unboxing Disclaimer (scrolling bar)</label><textarea value={policies.unboxingDisclaimer} onChange={(e) => setPolicies({ ...policies, unboxingDisclaimer: e.target.value })} className="admin-input" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Cancellation Heading</label><input type="text" value={policies.cancellationHeading} onChange={(e) => setPolicies({ ...policies, cancellationHeading: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Cancellation Text</label><input type="text" value={policies.cancellationText} onChange={(e) => setPolicies({ ...policies, cancellationText: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Return Heading</label><input type="text" value={policies.returnHeading} onChange={(e) => setPolicies({ ...policies, returnHeading: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Return Text</label><input type="text" value={policies.returnText} onChange={(e) => setPolicies({ ...policies, returnText: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Refund Heading</label><input type="text" value={policies.refundHeading} onChange={(e) => setPolicies({ ...policies, refundHeading: e.target.value })} className="admin-input" /></div>
            <div><label className="block text-sm font-medium mb-1">Refund Text</label><input type="text" value={policies.refundText} onChange={(e) => setPolicies({ ...policies, refundText: e.target.value })} className="admin-input" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Policy Note</label><input type="text" value={policies.policyNote} onChange={(e) => setPolicies({ ...policies, policyNote: e.target.value })} className="admin-input" /></div>
        </div>
      </div>
    </div>
  );

  function updateTrustItem(index: number, field: string, value: string) {
    const next = [...trustItems];
    next[index] = { ...next[index], [field]: value };
    setTrustItems(next);
  }

  function updateWhyItem(index: number, field: string, value: string) {
    const next = { ...whyChooseUs, items: whyChooseUs.items.map((it, i) => i === index ? { ...it, [field]: value } : it) };
    setWhyChooseUs(next);
  }
}
