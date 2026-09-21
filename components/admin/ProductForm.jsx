"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Plus, Trash2, Loader2, Youtube, Instagram } from "lucide-react";
import { categoriesAPI } from "@/lib/apiClient";

const FALLBACK_CATEGORIES = [
  "Machines", "Films & Rolls", "Void Fill", "Wrap",
  "Securing", "Boxes", "Tapes", "Pouches", "Bags", "Strapping",
];
function BulletListEditor({ label, items, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={val}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
              placeholder={placeholder || `${label} ${i + 1}`}
            />
            <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])} className="flex items-center gap-1.5 text-sm text-rust hover:underline">
          <Plus className="h-3.5 w-3.5" /> Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}
function ImageUploadZone({ label, preview, onFile, onClear }) {
  const ref = useRef();
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="" className="h-32 w-32 rounded-xl border border-gray-200 object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition hover:border-rust/50 hover:bg-rust/5 hover:text-rust"
        >
          <Upload className="h-5 w-5" />
          <span className="text-xs">Upload</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files[0])} />
    </div>
  );
}

function VideoLinkFields({ youtubeUrl, instagramUrl, onYoutubeChange, onInstagramChange }) {
  const bothFilled = youtubeUrl.trim() && instagramUrl.trim();
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Youtube className="h-4 w-4 text-gray-400" /> YouTube Video URL
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => onYoutubeChange(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
        />
      </div>
      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
          <Instagram className="h-4 w-4 text-gray-400" /> Instagram Video URL
          <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="url"
          value={instagramUrl}
          onChange={(e) => onInstagramChange(e.target.value)}
          placeholder="https://www.instagram.com/reel/..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
        />
      </div>
      {bothFilled && (
        <p className="text-xs text-amber-600">
          Both links are set — the YouTube video will be shown wherever a product video is displayed.
        </p>
      )}
    </div>
  );
}

export default function ProductForm({ initial = {}, onSubmit, loading, submitLabel = "Save Product" }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    categoriesAPI.list()
      .then((data) => {
        const cats = (data.categories || []).filter((c) => c !== "All");
        if (cats.length > 0) setCategories(cats);
      })
      .catch(() => {}); 
  }, []);

  const [form, setForm] = useState({
    name: initial.name || "",
    slug: initial.slug || "",
    category: initial.category || FALLBACK_CATEGORIES[0],
    description: initial.description || "",
    price: initial.price || "",
    compareAtPrice: initial.compareAtPrice || "",
    stock: initial.stock ?? 0,
    lowStockThreshold: initial.lowStockThreshold ?? 10,
    trackInventory: initial.trackInventory !== false,
    featured: initial.featured || false,
    isActive: initial.isActive !== false,
    metaTitle: initial.metaTitle || "",
    overview: initial.overview?.length ? initial.overview : [""],
keyFeatures: initial.keyFeatures?.length ? initial.keyFeatures : [""],
applications: initial.applications?.length ? initial.applications : [""],
    metaDescription: initial.metaDescription || "",
    specs: initial.specs?.length ? initial.specs : [""],
    sizes: initial.sizes?.length ? initial.sizes : [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(initial.image || "");
  const [extraImages, setExtraImages] = useState([]);
  const [extraPreviews, setExtraPreviews] = useState(initial.extraImages || []);
  const [youtubeUrl, setYoutubeUrl] = useState(initial.youtubeUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl || "");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const autoSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleMainImage = (file) => {
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleExtraImage = (file) => {
    if (!file) return;
    setExtraImages((p) => [...p, file]);
    setExtraPreviews((p) => [...p, URL.createObjectURL(file)]);
  };

  const removeExtra = (i) => {
    setExtraImages((p) => p.filter((_, idx) => idx !== i));
    setExtraPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    if (mainImage) fd.append("image", mainImage);
    else if (mainPreview) fd.append("keepImage", "true");

    extraImages.forEach((f, i) => fd.append(`extraImage_${i}`, f));

    fd.append("youtubeUrl", youtubeUrl.trim());
    fd.append("instagramUrl", instagramUrl.trim());

const fields = {
  ...form,
  specs: form.specs.filter(Boolean),
  sizes: form.sizes.filter(Boolean),
  overview: form.overview.filter(Boolean),
  keyFeatures: form.keyFeatures.filter(Boolean),
  applications: form.applications.filter(Boolean),
  price: String(form.price),
      compareAtPrice: form.compareAtPrice ? String(form.compareAtPrice) : "",
      stock: String(form.stock),
      lowStockThreshold: String(form.lowStockThreshold),
      featured: String(form.featured),
      isActive: String(form.isActive),
      trackInventory: String(form.trackInventory),
    };

    for (const [k, v] of Object.entries(fields)) {
      if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
      else fd.append(k, v);
    }

    onSubmit(fd, mainImage || mainPreview ? true : false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Basic Information</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!initial.slug) set("slug", autoSlug(e.target.value));
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
              placeholder="e.g. Air Cushion Machine"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug (URL) *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
              placeholder="air-cushion-machine"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Category *</label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const cat = newCategory.trim();
                      if (cat) {
                        setCategories((prev) => [...prev, cat]);
                        set("category", cat);
                      }
                      setNewCategory("");
                      setShowNewCategory(false);
                    }
                    if (e.key === "Escape") {
                      setShowNewCategory(false);
                      setNewCategory("");
                    }
                  }}
                  placeholder="Type new category, press Enter"
                  className="flex-1 rounded-xl border border-rust px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rust/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const cat = newCategory.trim();
                    if (cat) {
                      setCategories((prev) => [...prev, cat]);
                      set("category", cat);
                    }
                    setNewCategory("");
                    setShowNewCategory(false);
                  }}
                  className="rounded-xl bg-rust px-3 py-2.5 text-sm font-semibold text-white hover:bg-rust/90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowNewCategory(false); setNewCategory(""); }}
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  title="Add new category"
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-500 hover:border-rust hover:text-rust transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New
                </button>
              </div>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
            />
          </div>
        </div>
      </section>
<section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
  <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">
    Product Details Tab Content
  </h3>
  <div className="grid gap-6 sm:grid-cols-3">
    <BulletListEditor
      label="Product Overview"
      items={form.overview}
      onChange={(v) => set("overview", v)}
    />
    <BulletListEditor
      label="Key Features"
      items={form.keyFeatures}
      onChange={(v) => set("keyFeatures", v)}
    />
    <BulletListEditor
      label="Applications"
      items={form.applications}
      onChange={(v) => set("applications", v)}
    />
  </div>
</section>
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Product Images</h3>
        <div className="flex flex-wrap gap-4">
          <ImageUploadZone
            label="Main Image *"
            preview={mainPreview}
            onFile={handleMainImage}
            onClear={() => { setMainImage(null); setMainPreview(""); }}
          />
          {extraPreviews.map((src, i) => (
            <div key={i} className="space-y-2">
              {i === 0 && <label className="block text-sm font-medium text-gray-700">Extra Images</label>}
              {i !== 0 && <div className="h-5" />}
              <div className="relative inline-block">
                <img src={src} alt="" className="h-32 w-32 rounded-xl border border-gray-200 object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtra(i)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          <ImageUploadZone
            label={extraPreviews.length === 0 ? "Extra Images" : <span className="invisible">_</span>}
            preview=""
            onFile={handleExtraImage}
            onClear={() => {}}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Product Video</h3>
        <VideoLinkFields
          youtubeUrl={youtubeUrl}
          instagramUrl={instagramUrl}
          onYoutubeChange={setYoutubeUrl}
          onInstagramChange={setInstagramUrl}
        />
        <p className="mt-3 text-xs text-gray-400">
          Paste a YouTube and/or Instagram link instead of uploading a file. The video shows on card hover &amp; the product page. If both are set, YouTube is used.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Pricing</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Price (₹) *</label>
            <input
              required type="number" min="0" step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Compare-at Price (₹)</label>
            <input
              type="number" min="0" step="0.01"
              value={form.compareAtPrice}
              onChange={(e) => set("compareAtPrice", e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
              placeholder="Optional"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Inventory</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Stock Quantity</label>
            <input
              type="number" min="0"
              value={form.stock}
              onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Low Stock Alert At</label>
            <input
              type="number" min="0"
              value={form.lowStockThreshold}
              onChange={(e) => set("lowStockThreshold", parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
            />
          </div>
          <div className="flex flex-col gap-3 pt-6">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" checked={form.trackInventory} onChange={(e) => set("trackInventory", e.target.checked)} className="h-4 w-4 rounded accent-rust" />
              <span className="text-sm text-gray-700">Track inventory</span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Specifications & Sizes</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Specs</label>
            <div className="space-y-2">
              {form.specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={(e) => {
                      const next = [...form.specs];
                      next[i] = e.target.value;
                      set("specs", next);
                    }}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
                    placeholder={`Spec ${i + 1}`}
                  />
                  <button type="button" onClick={() => set("specs", form.specs.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("specs", [...form.specs, ""])} className="flex items-center gap-1.5 text-sm text-rust hover:underline">
                <Plus className="h-3.5 w-3.5" /> Add spec
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Available Sizes</label>
            <div className="space-y-2">
              {form.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={(e) => {
                      const next = [...form.sizes];
                      next[i] = e.target.value;
                      set("sizes", next);
                    }}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
                    placeholder="e.g. 120×180 · 85 pcs"
                  />
                  <button type="button" onClick={() => set("sizes", form.sizes.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => set("sizes", [...form.sizes, ""])} className="flex items-center gap-1.5 text-sm text-rust hover:underline">
                <Plus className="h-3.5 w-3.5" /> Add size
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Visibility & SEO</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded accent-rust" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded accent-rust" />
              <span className="text-sm text-gray-700">Active (visible)</span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Title</label>
            <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20" />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-rust px-6 py-3 text-sm font-semibold text-white transition hover:bg-rust/90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}