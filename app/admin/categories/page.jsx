"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Upload, X, Loader2, ImageOff, Plus, Pencil, Trash2, Check } from "lucide-react";
import { adminAPI } from "@/lib/apiClient";
import ConfirmModal from "@/components/admin/ConfirmModal";

function CategoryCard({ category, onUploaded, onImageRemoved, onRenamed, onDeleted }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(category.name);
  const [uploadError, setUploadError] = useState("");
  const [modal, setModal] = useState(null); // "rename" | "delete" | "image" | null

  const pickFile = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploadError("");
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("image", file);
      const res = await adminAPI.uploadCategoryImage(formData);
      onUploaded(category.name, res.category.image);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setBusy(false);
      setPreview(null);
      e.target.value = "";
    }
  };

  const startEdit = () => {
    setDraftName(category.name);
    setEditing(true);
  };

  // Opens the confirm dialog (no-op if the name didn't change)
  const requestRename = () => {
    const next = draftName.trim();
    if (!next) return;
    if (next === category.name) {
      setEditing(false);
      return;
    }
    setModal("rename");
  };

  // The modal calls these; throwing keeps it open and shows the error inline.
  const doRename = async () => {
    const next = draftName.trim();
    const res = await adminAPI.renameCategory(category.name, next);
    onRenamed(category.name, { name: next, slug: res.category?.slug });
    setEditing(false);
  };

  const doRemoveImage = async () => {
    await adminAPI.removeCategoryImage(category.name);
    onImageRemoved(category.name);
  };

  const doDelete = async () => {
    await adminAPI.deleteCategory(category.name);
    onDeleted(category.name);
  };

  const displayImage = preview || category.image;
  const canDelete = !category.inUse;

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
        {!category.inUse && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            No products yet
          </span>
        )}
        {category.image && !editing && (
          <button
            type="button"
            onClick={() => setModal("image")}
            disabled={busy}
            title="Remove image"
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors hover:text-red-500 disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-rust" />
          </div>
        )}
      </div>

      <div className="p-4">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") requestRename();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              disabled={busy}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
            />
            <button
              type="button"
              onClick={requestRename}
              disabled={busy || !draftName.trim()}
              title="Save"
              className="grid h-8 w-8 place-items-center rounded-lg bg-rust text-white hover:bg-rust/90 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              title="Cancel"
              className="grid h-8 w-8 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <p className="truncate text-sm font-semibold text-gray-900">{category.name}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {category.productCount || 0} product{category.productCount === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}

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
          <button
            type="button"
            onClick={startEdit}
            disabled={busy || editing}
            title="Rename category"
            className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-rust hover:text-rust disabled:opacity-50"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setModal("delete")}
            disabled={busy || !canDelete}
            title={
              canDelete
                ? "Delete category"
                : `Can't delete — ${category.productCount} product(s) use it`
            }
            className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-transparent"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ConfirmModal
        open={modal === "rename"}
        onClose={() => setModal(null)}
        onConfirm={doRename}
        variant="primary"
        icon={Pencil}
        title="Rename category?"
        description={
          category.productCount
            ? `${category.productCount} product${category.productCount === 1 ? " is" : "s are"} in this category and will be updated too.`
            : "No products use this category yet."
        }
        confirmLabel="Rename"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm">
            <span className="min-w-0 truncate text-gray-400 line-through">{category.name}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="min-w-0 truncate font-semibold text-gray-900">{draftName.trim()}</span>
          </div>
          <p className="text-xs text-gray-500">
            The category page URL will change, so old links to it will stop working.
          </p>
        </div>
      </ConfirmModal>

      <ConfirmModal
        open={modal === "image"}
        onClose={() => setModal(null)}
        onConfirm={doRemoveImage}
        variant="danger"
        icon={ImageOff}
        title="Remove category image?"
        description={`"${category.name}" will fall back to the default image on the homepage. The category and its products are not affected.`}
        confirmLabel="Remove image"
      />

      <ConfirmModal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        onConfirm={doDelete}
        variant="danger"
        icon={Trash2}
        title={`Delete "${category.name}"?`}
        description="This permanently removes the category and its image. This action can't be undone."
        confirmLabel="Delete category"
      />
    </div>
  );
}

function NewCategoryForm({ onCreated, onCancel }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (file) formData.append("image", file);
      const res = await adminAPI.uploadCategoryImage(formData);
      onCreated(res.category);
    } catch (err) {
      setError(err.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-gray-200 bg-white p-5"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Category name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Strapping"
            autoFocus
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            {preview ? (
              <img src={preview} alt="" className="h-5 w-5 rounded object-cover" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {file ? file.name : "Choose file"}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-rust px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rust/90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

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

  const handleImageRemoved = (name) => {
    setCategories((prev) => prev.map((c) => (c.name === name ? { ...c, image: null } : c)));
  };

  const handleRenamed = (oldName, { name, slug }) => {
    setCategories((prev) =>
      prev
        .map((c) => (c.name === oldName ? { ...c, name, slug: slug || c.slug } : c))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleDeleted = (name) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  const handleCreated = (category) => {
    setCategories((prev) =>
      [...prev.filter((c) => c.name !== category.name), { productCount: 0, ...category, inUse: false }].sort(
        (a, b) => a.name.localeCompare(b.name)
      )
    );
    setShowNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, rename and delete categories, and set the image shown for each on the homepage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {!showNew && (
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 rounded-xl bg-rust px-4 py-2 text-sm font-semibold text-white hover:bg-rust/90"
            >
              <Plus className="h-4 w-4" />
              New Category
            </button>
          )}
        </div>
      </div>

      {showNew && (
        <NewCategoryForm onCreated={handleCreated} onCancel={() => setShowNew(false)} />
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories…
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-500">
          No categories yet — create one above, or add a product with a new category name.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard
              key={c.name}
              category={c}
              onUploaded={handleUploaded}
              onImageRemoved={handleImageRemoved}
              onRenamed={handleRenamed}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}