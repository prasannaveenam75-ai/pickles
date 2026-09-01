"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const weightOptions = ["500g", "1kg"];

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [category, setCategory] = useState(product?.category || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [ingredients, setIngredients] = useState<string[]>(product?.ingredients || []);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [featured, setFeatured] = useState(product?.featured || false);
  const [bestSeller, setBestSeller] = useState(product?.bestSeller || false);
  const [active, setActive] = useState(product?.active ?? true);
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || "");

  const [variants, setVariants] = useState<any[]>(
    product?.variants?.length
      ? product.variants.map((v: any) => ({
          _id: v._id,
          name: v.name,
          weight: v.weight,
          weightInGrams: v.weightInGrams,
          price: v.price,
          compareAtPrice: v.compareAtPrice || "",
          stock: v.stock,
          active: v.active ?? true,
        }))
      : weightOptions.map((w) => ({
          name: w,
          weight: w,
          weightInGrams: w === "500g" ? 500 : 1000,
          price: "",
          compareAtPrice: "",
          stock: 10,
          active: true,
        }))
  );

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ingredientsStr, setIngredientsStr] = useState(product?.ingredients?.join(", ") || "");
  const [tagsStr, setTagsStr] = useState(product?.tags?.join(", ") || "");
  const [uploading, setUploading] = useState(false);

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", weight: "", weightInGrams: 0, price: "", stock: 0, active: true }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          setImages((prev) => [...prev, data.data.url]);
        }
      } catch {}
    }
    setUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!name || !category) {
      setError("Name and category are required");
      setSaving(false);
      return;
    }

    const finalVariants = variants.map((v) => ({
      ...v,
      _id: v._id || undefined,
      weightInGrams: v.weight === "1kg" ? 1000 : v.weight === "500g" ? 500 : parseInt(v.weightInGrams) || 500,
      price: parseFloat(v.price) || 0,
      compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
      stock: parseInt(v.stock) || 0,
    }));

    const body = {
      name,
      slug: slug || name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, ""),
      category,
      shortDescription,
      description,
      ingredients: ingredientsStr.split(",").map((s: string) => s.trim()).filter(Boolean),
      tags: tagsStr.split(",").map((s: string) => s.trim()).filter(Boolean),
      variants: finalVariants,
      images,
      featured,
      bestSeller,
      active,
      seoTitle,
      seoDescription,
    };

    try {
      if (isEdit) {
        await fetch(`/api/admin/products/${product._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      router.push("/admin/products");
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add Product"}</h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push("/admin/products")} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button type="submit" disabled={saving} className="admin-btn disabled:opacity-50">
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red/10 border border-red/30 text-red rounded-lg p-4 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1.5">Product Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" placeholder="e.g. Usiri Pickle" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="admin-input" placeholder="usiri-pickle" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
              <option value="">Select category</option>
              <option value="Veg Pickles">Veg Pickles</option>
              <option value="Non-Veg Pickles">Non-Veg Pickles</option>
              <option value="Powders">Powders</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Short Description</label>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="admin-input min-h-[60px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input min-h-[100px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Ingredients (comma separated)</label>
            <input type="text" value={ingredientsStr} onChange={(e) => setIngredientsStr(e.target.value)} className="admin-input" placeholder="Tomato, Red Chilli, Garlic" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
            <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="admin-input" placeholder="veg, spicy, tangy" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900 text-lg">Variants & Pricing</h2>
              <button type="button" onClick={handleAddVariant} className="text-sm text-green font-medium">+ Add Variant</button>
            </div>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Variant {index + 1}</span>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red text-xs">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Weight</label>
                      <input type="text" value={variant.weight} onChange={(e) => handleVariantChange(index, "weight", e.target.value)} className="admin-input" placeholder="500g" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Price (₹) *</label>
                      <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} className="admin-input" placeholder="300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Compare At (₹)</label>
                      <input type="number" value={variant.compareAtPrice || ""} onChange={(e) => handleVariantChange(index, "compareAtPrice", e.target.value)} className="admin-input" placeholder="350" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Stock *</label>
                      <input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="admin-input" placeholder="10" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={variant.active} onChange={(e) => handleVariantChange(index, "active", e.target.checked)} className="accent-green" />
                    Active
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Images</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Product image ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red text-white w-6 h-6 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="block">
              <span className="admin-btn cursor-pointer inline-block">
                {uploading ? "Uploading..." : "Upload Images"}
              </span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg">Product Settings</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Featured</span>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-green w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Best Seller</span>
              <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="accent-green w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active</span>
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-green w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg">SEO</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">SEO Title</label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SEO Description</label>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="admin-input" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
