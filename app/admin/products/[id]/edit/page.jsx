"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { adminAPI } from "@/lib/apiClient";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminAPI.getProduct(params.id)
      .then((res) => setProduct(res.product))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingProduct(false));
  }, [params.id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError("");
    try {
      await adminAPI.updateProduct(params.id, formData);
      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 font-mono">{product?.slug}</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Product updated! Redirecting…
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loadingProduct ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : product ? (
        <ProductForm initial={product} onSubmit={handleSubmit} loading={saving} submitLabel="Update Product" />
      ) : (
        <p className="text-gray-500">Product not found.</p>
      )}
    </div>
  );
}
