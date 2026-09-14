"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, Layers, Users, LogOut, Menu, X,
  ChevronRight, BarChart3, Grid3x3,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
     
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Grid3x3 },
  { href: "/admin/inventory", label: "Inventory", icon: Layers },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, isLoggedIn, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Extra safety: don't redirect until we've waited at least one render
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    // Give one tick after hydration before deciding
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, [hydrated]);

  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn || user?.role !== "admin") {
      router.replace("/admin-login");
    }
  }, [ready, isLoggedIn, user, router]);

  // While waiting for hydration or auth check — show spinner, not redirect
  if (!hydrated || !ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6FA]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3d7a72] border-t-transparent" />
        <p className="text-sm text-gray-500">Checking authentication…</p>
      </div>
    );
  }

  // After hydration — not logged in or not admin
  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6FA]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3d7a72] border-t-transparent" />
        <p className="text-sm text-gray-500">Redirecting…</p>
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6FA]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-cream shadow-xl transition-transform duration-300 custom-height
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rust text-white">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">DPack Admin</p>
            <p className="text-[10px] text-white/40">Control Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-white/50 hover:bg-white/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${active ? "bg-rust text-white shadow-md" : "text-white/60 hover:bg-white/8 hover:text-white"}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rust text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-white">{user?.name || "Admin"}</p>
              <p className="text-[11px] text-white/40">{user?.mobile}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex h-screen flex-1 flex-col overflow-hidden lg:ml-64">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-gray-900">Admin</Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-gray-900 capitalize">
                  {pathname.split("/").pop()}
                </span>
              </>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-400">Hello Mr. Admin</span>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              View Site
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}