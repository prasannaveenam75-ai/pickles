"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Package, Search, Star, Snowflake, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p._id !== id));
    } catch {}
    finally { setDeleting(null); }
  };

  const toggleProp = async (id: string, prop: string, value: boolean) => {
    const updated = products.map((p) => p._id === id ? { ...p, [prop]: value } : p);
    setProducts(updated);
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [prop]: value }),
    });
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.subcategory?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new" className="admin-btn inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input pl-10"
          placeholder="Search products..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Add your first product or adjust your search."
          actionLabel="Add Product"
          actionHref="/admin/products/new"
        />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Variants</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flags</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const activeVariants = product.variants?.filter((v: any) => v.active) || [];
                  const minPrice = activeVariants.length ? Math.min(...activeVariants.map((v: any) => v.price)) : 0;
                  return (
                    <tr key={product._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">/{product.slug}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        <span className="text-xs">{product.category}</span>
                        {product.subcategory && <span className="block text-[10px] text-gray-400">{product.subcategory}</span>}
                      </td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(minPrice)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {activeVariants.slice(0, 3).map((v: any) => (
                            <span key={v._id} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {v.weight} · ₹{v.price}
                            </span>
                          ))}
                          {activeVariants.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">
                              +{activeVariants.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => toggleProp(product._id, "featured", !product.featured)}
                            className={`text-[10px] px-2 py-1 rounded font-medium ${product.featured ? "bg-golden/20 text-golden-dark" : "bg-gray-100 text-gray-500"}`}
                          >
                            <Star className="w-3 h-3 inline mr-0.5" />Featured
                          </button>
                          <button
                            onClick={() => toggleProp(product._id, "bestSeller", !product.bestSeller)}
                            className={`text-[10px] px-2 py-1 rounded font-medium ${product.bestSeller ? "bg-red/10 text-red" : "bg-gray-100 text-gray-500"}`}
                          >
                            Best Seller
                          </button>
                          <button
                            onClick={() => toggleProp(product._id, "newProduct", !product.newProduct)}
                            className={`text-[10px] px-2 py-1 rounded font-medium ${product.newProduct ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}
                          >
                            <Sparkles className="w-3 h-3 inline mr-0.5" />New
                          </button>
                          <button
                            onClick={() => toggleProp(product._id, "seasonal", !product.seasonal)}
                            className={`text-[10px] px-2 py-1 rounded font-medium ${product.seasonal ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            <Snowflake className="w-3 h-3 inline mr-0.5" />Seasonal
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleProp(product._id, "active", !product.active)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium ${product.active ? "bg-veg/10 text-veg" : "bg-gray-100 text-gray-500"}`}
                        >
                          {product.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/products/${product._id}`} className="p-2 text-gray-500 hover:text-green">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleting === product._id}
                            className="p-2 text-gray-500 hover:text-red disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}