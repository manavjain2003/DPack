"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingCart, RefreshCw, Search, ChevronLeft, ChevronRight, Truck, AlertCircle,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";
import { formatINR } from "@/lib/cartBus";
import { StatusBadge, PaymentBadge, shortId, formatDate } from "@/components/admin/OrderBadges";

const TABS = [
  { key: "paid", label: "All received" },
  { key: "confirmed", label: "To ship" },
  { key: "processing", label: "Pickup pending" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "returned", label: "Returned" },
  { key: "cancelled", label: "Cancelled" },
  { key: "unpaid", label: "Unpaid" },
];

const LIMIT = 20;

function RowSkeleton() {
  return (
    <tr className="border-b border-gray-50">
      {[
        "w-20", "w-32", "w-40", "w-14", "w-16", "w-20", "w-28", "w-20",
      ].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={`h-4 ${w} animate-pulse rounded bg-gray-100`} />
          {i === 1 && <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />}
        </td>
      ))}
    </tr>
  );
}

function OrdersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const view = params.get("view") || "paid";

  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const reqId = useRef(0);

  const load = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    setError("");
    try {
      const res = await adminAPI.listOrders({ page, limit: LIMIT, view, q: debounced });
      if (id !== reqId.current) return;
      setOrders(res.orders);
      setTotal(res.total);
      setCounts(res.counts);
    } catch (e) {
      if (id !== reqId.current) return;
      setError(e.message || "Failed to load orders");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [page, view, debounced]);

  useEffect(() => { load(); }, [load]);

  const changeView = (key) => {
    setPage(1);
    router.replace(key === "paid" ? "/admin/orders" : `/admin/orders?view=${key}`);
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            {counts ? `${counts.paid} orders received · ${counts.unpaid} unpaid checkouts` : "Orders placed by your customers"}
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

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => {
          const active = view === t.key;
          const n = counts ? (t.key === "paid" ? counts.paid : counts[t.key]) : null;
          return (
            <button
              key={t.key}
              onClick={() => changeView(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-rust bg-rust text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.label}
              {n === null ? (
                <span className={`h-4 w-5 animate-pulse rounded-full ${active ? "bg-white/30" : "bg-gray-100"}`} />
              ) : (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, mobile, email, order # or AWB"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          <button onClick={load} className="ml-auto font-semibold underline">Retry</button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {!loading && !error && orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShoppingCart className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500">
              {debounced ? "No orders match your search" : "No orders in this view yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Shipment</th>
                  <th className="px-4 py-3.5">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? [...Array(8)].map((_, i) => <RowSkeleton key={i} />)
                  : orders.map((o) => (
                      <tr
                        key={o._id}
                        onClick={() => router.push(`/admin/orders/${o._id}`)}
                        className="cursor-pointer hover:bg-gray-50/70"
                      >
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/admin/orders/${o._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[13px] font-semibold text-rust hover:underline"
                          >
                            #{shortId(o._id)}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">{o.customerName || "—"}</p>
                          <p className="text-xs text-gray-400">{o.customerMobile}</p>
                        </td>
                        <td className="max-w-[220px] px-4 py-3.5">
                          <p className="truncate text-gray-700">{o.items?.[0]?.name || "—"}</p>
                          {(o.items?.length || 0) > 1 && (
                            <p className="text-xs text-gray-400">+{o.items.length - 1} more</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{formatINR(o.total)}</td>
                        <td className="px-4 py-3.5"><PaymentBadge status={o.paymentStatus} /></td>
                        <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3.5">
                          {o.shipment?.awbCode ? (
                            <div className="flex items-center gap-1.5 text-gray-700">
                              <Truck className="h-3.5 w-3.5 text-gray-400" />
                              <div>
                                <p className="text-xs font-medium">{o.shipment.courierName || "Courier"}</p>
                                <p className="font-mono text-[11px] text-gray-400">{o.shipment.awbCode}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Not shipped</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-gray-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-gray-100" />}>
      <OrdersContent />
    </Suspense>
  );
}
