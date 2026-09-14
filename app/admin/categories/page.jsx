"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Upload, X, Loader2, ImageOff } from "lucide-react";
import { adminAPI } from "@/lib/apiClient";

function CategoryCard({ category, onUploaded, onRemoved }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  const pickFile = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("image", file);
      const res = await adminAPI.uploadCategoryImage(formData);
      onUploaded(category.name, res.category.image);
    } catch (err) {
      alert("Failed to upload: " + err.message);
    } finally {
      setBusy(false);
      setPreview(null);
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    if (!category.image) return;
    if (!confirm(`Remove the image for "${category.name}"? It'll fall back to the default.`)) return;
    setBusy(true);
    try {
      await adminAPI.removeCategoryImage(category.name);
      onRemoved(category.name);
    } catch (err) {
      alert("Failed to remove: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  const displayImage = preview || category.image;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="relative aspect-[4/3] bg-gray-50">
        {displayImage ? (
          <img src={displayImage} alt={category.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-300">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs font-medium">No image set</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-rust" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="truncate text-sm font-semibold text-gray-900">{category.name}</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-rust hover:text-rust disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {category.image ? "Replace" : "Upload"}
          </button>
          {category.image && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminAPI
      .listCategoryImages()
      .then((res) => setCategories(res.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUploaded = (name, image) => {
    setCategories((prev) => prev.map((c) => (c.name === name ? { ...c, image } : c)));
  };

  const handleRemoved = (name) => {
    setCategories((prev) => prev.map((c) => (c.name === name ? { ...c, image: null } : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set the image shown for each category on the homepage
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
          No categories yet — categories are created automatically once a product uses one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.name}
              category={c}
              onUploaded={handleUploaded}
              onRemoved={handleRemoved}
            />
          ))}
        </div>
      )}
    </div>
  );
}