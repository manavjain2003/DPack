"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package, Users, AlertTriangle, TrendingUp, ShoppingBag, Layers, ArrowRight,
  RefreshCw, ShoppingCart, Truck, PackageCheck, Clock, IndianRupee, AlertCircle,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";
import { formatINR } from "@/lib/cartBus";
import { StatusBadge, shortId, formatDate } from "@/components/admin/OrderBadges";


const Bone = ({ className = "", ...rest }) => (
  <div className={`animate-pulse rounded bg-gray-100 ${className}`} {...rest} />
);

function StatCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <Bone className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2.5">
        <Bone className="h-3.5 w-24" />
        <Bone className="h-7 w-16" />
        <Bone className="h-3 w-20" />
      </div>
    </div>
  );
}

function OrdersOverviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <div className="space-y-4 border-b border-gray-100 p-6 lg:border-b-0 lg:border-r">
          <Bone className="h-3.5 w-28" />
          <Bone className="h-12 w-24" />
          <Bone className="h-3.5 w-40" />
          <Bone className="h-9 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 bg-white p-5">
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-6 w-10" />
              <Bone className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentOrdersSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <Bone className="h-3.5 w-32" />
        <Bone className="h-3.5 w-16" />
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bone className="h-4 w-20" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-36" />
              <Bone className="h-3 w-24" />
            </div>
            <Bone className="h-5 w-20 rounded-full" />
            <Bone className="h-4 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Bone className="mb-4 h-3.5 w-36" />
      <div className="flex flex-wrap gap-2">
        {[88, 104, 72, 120, 96, 80].map((w, i) => (
          <Bone key={i} className="h-7 rounded-full" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}


const COLOR_MAP = {
  rust: "bg-rust/10 text-rust",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

function StatCard({ icon: Icon, label, value, sub, color = "rust", href }) {
  const card = (
    <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLOR_MAP[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] text-gray-500">{label}</p>
        <p className="mt-0.5 text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        {sub && <p className="mt-1 text-[12px] text-gray-400">{sub}</p>}
      </div>
      {href && <ArrowRight className="ml-auto mt-1 h-4 w-4 text-gray-300 transition group-hover:text-gray-500" />}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function OrdersOverview({ orders }) {
  const o = orders || {};
  const tiles = [
    { label: "To ship", value: o.toShip, icon: Clock, color: "amber", href: "/admin/orders?view=confirmed", sub: "paid, awaiting dispatch" },
    { label: "Shipped", value: o.shipped, icon: Truck, color: "indigo", href: "/admin/orders?view=shipped", sub: "in transit" },
    { label: "Delivered", value: o.delivered, icon: PackageCheck, color: "green", href: "/admin/orders?view=delivered", sub: "completed" },
    { label: "Unpaid", value: o.unpaid, icon: AlertCircle, color: "red", href: "/admin/orders?view=unpaid", sub: "abandoned checkouts" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gradient-to-br from-ink to-[#16283d] p-6 text-white lg:border-b-0">
          <div>
            <div className="flex items-center gap-2 text-[13px] text-white/60">
              <ShoppingCart className="h-4 w-4" /> Total Orders
            </div>
            <p className="mt-2 text-5xl font-bold tracking-tight">{o.total ?? 0}</p>
            <p className="mt-2 text-[13px] text-white/60">
              {o.last30d ?? 0} in the last 30 days
            </p>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-white/60">
              <IndianRupee className="h-3.5 w-3.5" />
              {formatINR(o.revenue || 0)} revenue
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rust px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View all orders <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
          {tiles.map(({ label, value, icon: Icon, color, href, sub }) => (
            <Link key={label} href={href} className="group bg-white p-5 transition hover:bg-gray-50">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${COLOR_MAP[color]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">{value ?? 0}</p>
              <p className="text-[13px] font-medium text-gray-700">{label}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentOrders({ orders = [] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Recent Orders</h2>
        <Link href="/admin/orders" className="text-[13px] font-medium text-rust hover:underline">View all</Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ShoppingCart className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">No orders received yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {orders.map((o) => (
            <li key={o._id}>
              <Link
                href={`/admin/orders/${o._id}`}
                className="-mx-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-2 py-3 transition hover:bg-gray-50"
              >
                <span className="font-mono text-[13px] font-semibold text-rust">#{shortId(o._id)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{o.customerName || "Customer"}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? "" : "s"}
                    {o.awbCode ? ` · AWB ${o.awbCode}` : ""}
                  </p>
                </div>
                <StatusBadge status={o.status} />
                <span className="w-20 text-right text-sm font-semibold text-gray-900">{formatINR(o.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const QUICK_LINKS = [
  { href: "/admin/orders", label: "Customer Orders", desc: "Review, ship and track orders", icon: ShoppingCart, tint: "bg-rust/10 text-rust" },
  { href: "/admin/products", label: "Manage Products", desc: "Add, edit or remove products", icon: Package, tint: "bg-blue-50 text-blue-600" },
  { href: "/admin/inventory", label: "Inventory", desc: "Track and update stock levels", icon: Layers, tint: "bg-amber-50 text-amber-600" },
  { href: "/admin/users", label: "Users", desc: "View registered customers", icon: Users, tint: "bg-green-50 text-green-600" },
];


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminAPI.getStats();
      setStats(res.stats);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await adminAPI.seed();
      setSeedMsg(res.message);
      await load();
    } catch (e) {
      setSeedMsg("Seed failed: " + e.message);
    } finally {
      setSeeding(false);
    }
  };

  const showSkeleton = loading && !stats;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your DPack store</p>
        </div>
        <div className="flex items-center gap-3">
          
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ {seedMsg}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          <button onClick={load} className="ml-auto font-semibold underline">Retry</button>
        </div>
      )}

      {showSkeleton ? (
        <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
          <OrdersOverviewSkeleton />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <RecentOrdersSkeleton />
          <CategoriesSkeleton />
        </div>
      ) : stats ? (
        <>
          <OrdersOverview orders={stats.orders} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Package} label="Total Products" value={stats.totalProducts} sub={`${stats.activeProducts} active`} color="blue" href="/admin/products" />
            <StatCard icon={Layers} label="Categories" value={stats.totalCategories} sub="product types" color="rust" />
            <StatCard icon={AlertTriangle} label="Out of Stock" value={stats.outOfStock} sub="needs restocking" color="red" href="/admin/inventory" />
            <StatCard icon={TrendingUp} label="Low Stock" value={stats.lowStock} sub="below threshold" color="amber" href="/admin/inventory" />
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub="registered" color="green" href="/admin/users" />
            <StatCard icon={ShoppingBag} label="New Users (30d)" value={stats.recentUsers} sub="this month" color="blue" />
          </div>

          <RecentOrders orders={stats.orders?.recent} />

          {stats.categories?.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Product Categories</h2>
              <div className="flex flex-wrap gap-2">
                {stats.categories.map((cat) => (
                  <span key={cat} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map(({ href, label, desc, icon: Icon, tint }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{label}</p>
              <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
            </div>
            <ArrowRight className="ml-auto mt-1 h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}
