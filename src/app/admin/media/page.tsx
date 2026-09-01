"use client";

import { useState } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminMediaPage() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <label className="admin-btn inline-flex items-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Images"}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <p className="text-sm text-gray-600 mb-6">
          Images uploaded here are stored on Cloudinary and can be used in products, categories and homepage content.
          Uploaded image URLs can be found below.
        </p>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images uploaded yet. Upload your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-red text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {img}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
