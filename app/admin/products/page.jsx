"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, Eye, Package,
  AlertTriangle, RefreshCw, ChevronLeft, ChevronRight,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";

function StockBadge({ product }) {
  if (!product.trackInventory) return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Untracked</span>;
  if (product.stock <= 0) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Out of stock</span>;
  if (product.stock <= product.lowStockThreshold) return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Low: {product.stock}</span>;
  return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{product.stock} in stock</span>;
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");
  const limit = 9; // 3 x 3 grid

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAPI.listProducts({ page, limit, search: search || undefined });
      setProducts(res.products);
      setTotal(res.total);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminAPI.deleteProduct(id);
      // reload so the grid stays filled with 9 items
      await load();
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{total} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-rust px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rust/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or category…"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={load} className="ml-auto text-red-500 hover:text-red-700"><RefreshCw className="h-4 w-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <Package className="h-10 w-10 text-gray-300" />
          <p className="font-semibold text-gray-500">No products found</p>
          <Link href="/admin/products/new" className="text-sm text-rust hover:underline">Add your first product</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gray-50">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-contain p-4"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur">
                  <span className={`h-2 w-2 rounded-full ${p.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-xs text-gray-600">{p.isActive ? "Active" : "Hidden"}</span>
                </div>
                {p.featured && (
                  <span className="absolute right-3 top-3 rounded-full bg-rust px-2 py-0.5 text-[10px] font-semibold text-white">
                    Featured
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="line-clamp-2 min-h-[2.5rem] font-semibold text-gray-900">{p.name}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-gray-400">{p.slug}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{p.category}</span>
                  <StockBadge product={p} />
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="font-semibold text-gray-900">
                    ₹{p.price?.toLocaleString("en-IN")}
                    {p.compareAtPrice > p.price && (
                      <span className="ml-1.5 text-xs font-normal text-gray-400 line-through">
                        ₹{p.compareAtPrice?.toLocaleString("en-IN")}
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      aria-label="View product"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition hover:border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      aria-label="Edit product"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      disabled={deleting === p._id}
                      aria-label="Delete product"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      {deleting === p._id
                        ? <RefreshCw className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}