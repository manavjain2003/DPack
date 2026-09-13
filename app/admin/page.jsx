"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, Users, AlertTriangle, TrendingUp,
  ShoppingBag, Layers, ArrowRight, RefreshCw,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";

function StatCard({ icon: Icon, label, value, sub, color = "rust", href }) {
  const colorMap = {
    rust: "bg-rust/10 text-rust",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };
  const card = (
    <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStats();
      setStats(res.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your DPack store</p>
        </div>
        <div className="flex items-center gap-3">
          {process.env.NODE_ENV !== "production" && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
            >
              {seeding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
              {seeding ? "Seeding…" : "Seed Sample Data"}
            </button>
          )}
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
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

      {/* Stats grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Package} label="Total Products" value={stats?.totalProducts} sub={`${stats?.activeProducts} active`} color="blue" href="/admin/products" />
          <StatCard icon={Layers} label="Categories" value={stats?.totalCategories} sub="product types" color="rust" />
          <StatCard icon={AlertTriangle} label="Out of Stock" value={stats?.outOfStock} sub="needs restocking" color="red" href="/admin/inventory" />
          <StatCard icon={TrendingUp} label="Low Stock" value={stats?.lowStock} sub="below threshold" color="amber" href="/admin/inventory" />
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} sub="registered" color="green" href="/admin/users" />
          <StatCard icon={ShoppingBag} label="New Users (30d)" value={stats?.recentUsers} sub="this month" color="blue" />
        </div>
      )}

      {/* Categories */}
      {stats?.categories?.length > 0 && (
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

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/products", label: "Manage Products", desc: "Add, edit or remove products", icon: Package, color: "rust" },
          { href: "/admin/inventory", label: "Inventory", desc: "Track and update stock levels", icon: Layers, color: "amber" },
          { href: "/admin/users", label: "Users", desc: "View registered customers", icon: Users, color: "blue" },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${color === "rust" ? "rust" : color === "amber" ? "amber-500" : "blue-500"}/10 text-${color === "rust" ? "rust" : color === "amber" ? "amber-600" : "blue-600"}`}>
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
