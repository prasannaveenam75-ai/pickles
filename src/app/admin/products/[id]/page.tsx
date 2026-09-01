"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "../ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProduct(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductForm product={product} />;
}
