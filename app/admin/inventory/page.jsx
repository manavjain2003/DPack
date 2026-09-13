"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package, AlertTriangle, RefreshCw, TrendingDown, CheckCircle2,
  ChevronUp, ChevronDown, Layers,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";

function StockBadge({ stock, threshold, track }) {
  if (!track) return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">Untracked</span>;
  if (stock <= 0) return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Out of Stock</span>;
  if (stock <= threshold) return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Low Stock</span>;
  return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">In Stock</span>;
}

function InlineEditor({ product, onSave }) {
  const [mode, setMode] = useState("set");
  const [qty, setQty] = useState("");
  const [threshold, setThreshold] = useState(product.lowStockThreshold ?? 10);
  const [track, setTrack] = useState(product.trackInventory !== false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await adminAPI.updateInventory(product._id, {
        action: mode,
        quantity: parseInt(qty) || 0,
        lowStockThreshold: threshold,
        trackInventory: track,
      });
      setSaved(true);
      onSave(product._id, res);
      setQty("");
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {["set", "add", "subtract"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
              mode === m ? "bg-rust text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {m === "set" ? "Set" : m === "add" ? "+ Add" : "− Subtract"}
          </button>
        ))}
        <input
          type="number"
          min="0"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-rust"
          placeholder="Qty"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-gray-600">
          Alert at:
          <input
            type="number" min="0" value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
            className="w-14 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-rust"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-600">
          <input type="checkbox" checked={track} onChange={(e) => setTrack(e.target.checked)} className="accent-rust" />
          Track inventory
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-rust px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rust/90 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-3 w-3 animate-spin" /> : saved ? <CheckCircle2 className="h-3 w-3" /> : null}
          {saved ? "Saved!" : "Update"}
        </button>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all"); // all | low | out

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.listProducts({ limit: 100 });
      setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = (id, data) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              stock: data.stock,
              lowStockThreshold: data.lowStockThreshold,
              trackInventory: data.trackInventory !== false,
            }
          : p
      )
    );
  };

  const filtered = products.filter((p) => {
    if (filter === "out") return p.trackInventory && p.stock <= 0;
    if (filter === "low") return p.trackInventory && p.stock > 0 && p.stock <= p.lowStockThreshold;
    return true;
  });

  const outCount = products.filter((p) => p.trackInventory && p.stock <= 0).length;
  const lowCount = products.filter((p) => p.trackInventory && p.stock > 0 && p.stock <= p.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">Manage stock levels for all products</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button onClick={() => setFilter("all")} className={`rounded-2xl border p-5 text-left transition ${filter === "all" ? "border-rust/30 bg-rust/5" : "border-gray-100 bg-white hover:bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">All Products</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{products.length}</p>
        </button>
        <button onClick={() => setFilter("low")} className={`rounded-2xl border p-5 text-left transition ${filter === "low" ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-white hover:bg-amber-50/50"}`}>
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-700">Low Stock</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-800">{lowCount}</p>
        </button>
        <button onClick={() => setFilter("out")} className={`rounded-2xl border p-5 text-left transition ${filter === "out" ? "border-red-300 bg-red-50" : "border-gray-100 bg-white hover:bg-red-50/50"}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm font-medium text-red-700">Out of Stock</p>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-800">{outCount}</p>
        </button>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-gray-50 p-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">No products match this filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div key={p._id} className="p-4">
                <div
                  className="flex cursor-pointer items-center gap-4"
                  onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                >
                  <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 object-contain bg-gray-50 p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.trackInventory && (
                      <span className="hidden text-sm font-bold text-gray-700 sm:block">
                        {p.stock} units
                      </span>
                    )}
                    <StockBadge stock={p.stock} threshold={p.lowStockThreshold} track={p.trackInventory} />
                    {expanded === p._id
                      ? <ChevronUp className="h-4 w-4 text-gray-400" />
                      : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
                {expanded === p._id && (
                  <InlineEditor product={p} onSave={handleSave} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
