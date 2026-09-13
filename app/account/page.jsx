"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Building2, ReceiptText, Loader2, CheckCircle2, Package } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { userAPI, ordersAPI } from "@/lib/apiClient";
import { formatINR } from "@/lib/cartBus";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AccountPage() {
  const { user, setUser, isLoggedIn, hydrated } = useAuth();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
    address: "", billingAddress: "", gstNumber: "",
  });

  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    ordersAPI
      .list()
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        address: typeof user.address === "string"
          ? user.address
          : [user.address?.line1, user.address?.city, user.address?.state, user.address?.pincode].filter(Boolean).join(", "),
        billingAddress: typeof user.billingAddress === "string"
          ? user.billingAddress
          : [user.billingAddress?.line1, user.billingAddress?.city].filter(Boolean).join(", "),
        gstNumber: user.gstNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSameBillingAddress = (e) => {
    setSameBillingAddress(e.target.checked);
    if (e.target.checked) setFormData((prev) => ({ ...prev, billingAddress: prev.address }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await userAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        address: { line1: formData.address },
        billingAddress: { line1: formData.billingAddress },
        gstNumber: formData.gstNumber,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
          <p className="mt-2 text-gray-500">Please login to view your account details.</p>
        </div>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          <div className="mb-8">
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
            <p className="mt-2 text-sm text-gray-500">Manage your personal, contact and billing information.</p>
          </div>

          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <section className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              </div>

              {ordersLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading orders…
                </div>
              ) : orders.length === 0 ? (
                <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <li key={o._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{String(o._id).slice(-8)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          {" · "}
                          {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                          {o.status}
                        </span>
                        <span className="font-display text-sm font-bold text-gray-900">
                          {formatINR(o.total)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Personal Info */}
            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm text-gray-500">Your basic account information.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { id: "name", label: "Full Name", icon: User, type: "text", placeholder: "Enter your full name" },
                  { id: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "Enter your email" },
                  { id: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "Phone", readonly: true },
                ].map(({ id, label, icon: Icon, type, placeholder, readonly }) => (
                  <div key={id}>
                    <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        id={id} name={id} type={type}
                        value={formData[id]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        readOnly={readonly}
                        className={`${inputCls} ${readonly ? "cursor-not-allowed bg-gray-50" : ""}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="border-t border-gray-200" />

            {/* Address */}
            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
              </div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full resize-none rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10" placeholder="Enter your complete address" />
              </div>
            </section>

            <div className="border-t border-gray-200" />

            {/* Billing */}
            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
              </div>
              <label className="mb-5 flex cursor-pointer items-center gap-3">
                <input type="checkbox" checked={sameBillingAddress} onChange={handleSameBillingAddress} className="h-4 w-4 rounded border-gray-300 accent-rust" />
                <span className="text-sm text-gray-700">Billing address is same as delivery address</span>
              </label>
              <div className="mb-6">
                <label htmlFor="billingAddress" className="mb-2 block text-sm font-medium text-gray-700">Billing Address</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <textarea id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleChange} disabled={sameBillingAddress} rows={3}
                    className={`w-full resize-none rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition ${sameBillingAddress ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500" : "border-gray-300 bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"}`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gstNumber" className="mb-2 block text-sm font-medium text-gray-700">GST Number <span className="ml-2 font-normal text-gray-400">(Optional)</span></label>
                <div className="relative">
                  <ReceiptText className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input id="gstNumber" name="gstNumber" type="text" value={formData.gstNumber} onChange={handleChange} placeholder="Enter your GST number" maxLength={15} className={`${inputCls} uppercase`} />
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200" />

            <div className="flex flex-col gap-4 bg-gray-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                {saved && <p className="flex items-center gap-2 text-sm font-medium text-green-600"><CheckCircle2 className="h-4 w-4" /> Saved successfully</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {!saved && !error && <p className="text-sm text-gray-500">Make sure your information is correct before saving.</p>}
              </div>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 active:scale-[0.98]">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}