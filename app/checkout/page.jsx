"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { ordersAPI } from "@/lib/apiClient";
import {
  useCart,
  clearCart,
  cartCount,
  cartSubtotal,
  formatINR,
} from "@/lib/cartBus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

function emptyAddress() {
  return { line1: "", line2: "", city: "", state: "", pincode: "", country: "India" };
}

function addressFrom(addr) {
  if (!addr || typeof addr !== "object") return emptyAddress();
  return {
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    city: addr.city || "",
    state: addr.state || "",
    pincode: addr.pincode || "",
    country: addr.country || "India",
  };
}

function Field({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-ink/70">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/12 px-4 py-2.5 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { user, isLoggedIn, hydrated, openLogin } = useAuth();
  const items = useCart();
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [shipping, setShipping] = useState(emptyAddress());
  const [billing, setBilling] = useState(emptyAddress());
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [gstNumber, setGstNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // Pre-fill from the user's saved profile
  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setMobile(user.mobile || "");
    if (user.address) setShipping((prev) => ({ ...prev, ...addressFrom(user.address) }));
    if (user.billingAddress) setBilling(addressFrom(user.billingAddress));
  }, [user]);

  const orderableItems = useMemo(
    () => items.filter((i) => OBJECT_ID_RE.test(i.key)),
    [items]
  );
  const unorderableCount = items.length - orderableItems.length;

  const setShippingField = (key, value) =>
    setShipping((prev) => ({ ...prev, [key]: value }));
  const setBillingField = (key, value) =>
    setBilling((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!shipping.line1.trim() || !shipping.city.trim() || !shipping.state.trim())
      return "Please complete the shipping address.";
    if (!/^\d{6}$/.test(shipping.pincode.trim()))
      return "Please enter a valid 6-digit pincode.";
    if (!sameAsShipping) {
      if (!billing.line1.trim() || !billing.city.trim() || !billing.state.trim())
        return "Please complete the billing address, or check 'same as shipping'.";
      if (!/^\d{6}$/.test(billing.pincode.trim()))
        return "Please enter a valid 6-digit billing pincode.";
    }
    if (orderableItems.length === 0) return "Your cart has nothing that can be ordered.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await ordersAPI.create({
        items: orderableItems.map((i) => ({ productId: i.key, qty: i.qty, name: i.name })),
        customerName: name,
        customerEmail: email,
        customerMobile: mobile,
        shippingAddress: shipping,
        billingAddress: billing,
        sameAsShipping,
        gstNumber,
        notes,
      });
      setPlacedOrder(res.order);
      clearCart();
    } catch (err) {
      setError(err.message || "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center bg-cream pt-20">
          <Loader2 className="h-6 w-6 animate-spin text-rust" />
        </main>
        <Footer />
      </>
    );
  }

  // ── Order placed ──────────────────────────────────────
  if (placedOrder) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-ink/8 bg-white p-8 text-center"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-50">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
                Order placed!
              </h1>
              <p className="mt-2 text-sm text-ink/50">
                Order <span className="font-mono font-semibold text-ink">#{String(placedOrder._id).slice(-8)}</span> has
                been received and is now pending confirmation.
              </p>

              <ul className="mt-6 space-y-2 rounded-xl bg-[#F9F6F0] p-4 text-left">
                {placedOrder.items.map((it, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-ink/70">
                      {it.name} <span className="text-ink/40">× {it.qty}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-ink">
                      {formatINR(it.price * it.qty)}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-ink/10 pt-2 text-sm font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatINR(placedOrder.total)}</span>
                </li>
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition-all hover:bg-rust/90"
                >
                  Continue shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-rust hover:text-rust"
                >
                  View my orders
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Not logged in ─────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center bg-cream px-5 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm rounded-2xl border border-ink/8 bg-white p-8 text-center"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rust/10">
              <Lock className="h-6 w-6 text-rust" />
            </div>
            <h1 className="mt-4 font-display text-xl font-bold text-ink">
              Sign in to check out
            </h1>
            <p className="mt-2 text-sm text-ink/50">
              We need your details to confirm delivery and billing before placing the order.
            </p>
            <button
              type="button"
              onClick={() => openLogin({ type: "checkout" })}
              className="mt-6 w-full rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition-all hover:bg-rust/90"
            >
              Sign in
            </button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Empty cart ────────────────────────────────────────
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center bg-cream px-5 pt-20">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-rust/10">
              <ShoppingBag className="h-7 w-7 text-rust" />
            </div>
            <h1 className="mt-5 font-display text-xl font-bold text-ink">
              Your cart is empty
            </h1>
            <p className="mt-2 max-w-xs text-sm text-ink/50">
              Add something to your cart before checking out.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-white hover:bg-rust/90"
            >
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Checkout form ─────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
        <div className="mx-auto max-w-8xl px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Checkout
            </h1>
            <p className="mt-1.5 text-sm text-ink/50">
              Confirm your details to place the order.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {unorderableCount > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {unorderableCount} item{unorderableCount > 1 ? "s" : ""} in your cart can't be
                  ordered and will be left out.
                </div>
              )}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <section className="rounded-2xl border border-ink/8 bg-white p-6">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-ink/40">
                  Contact details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name *" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Field label="Mobile number *" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                  <Field
                    label="Email (optional)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:col-span-2"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-ink/8 bg-white p-6">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-ink/40">
                  Shipping address
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Address line 1 *"
                    value={shipping.line1}
                    onChange={(e) => setShippingField("line1", e.target.value)}
                    className="sm:col-span-2"
                    required
                  />
                  <Field
                    label="Address line 2"
                    value={shipping.line2}
                    onChange={(e) => setShippingField("line2", e.target.value)}
                    className="sm:col-span-2"
                  />
                  <Field label="City *" value={shipping.city} onChange={(e) => setShippingField("city", e.target.value)} required />
                  <Field label="State *" value={shipping.state} onChange={(e) => setShippingField("state", e.target.value)} required />
                  <Field
                    label="Pincode *"
                    value={shipping.pincode}
                    onChange={(e) => setShippingField("pincode", e.target.value)}
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />
                  <Field label="Country" value={shipping.country} onChange={(e) => setShippingField("country", e.target.value)} />
                </div>
              </section>

              <section className="rounded-2xl border border-ink/8 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/40">
                    Billing address
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-ink/70">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="h-4 w-4 rounded border-ink/20 text-rust focus:ring-rust/30"
                    />
                    Same as shipping
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Address line 1 *"
                      value={billing.line1}
                      onChange={(e) => setBillingField("line1", e.target.value)}
                      className="sm:col-span-2"
                      required
                    />
                    <Field
                      label="Address line 2"
                      value={billing.line2}
                      onChange={(e) => setBillingField("line2", e.target.value)}
                      className="sm:col-span-2"
                    />
                    <Field label="City *" value={billing.city} onChange={(e) => setBillingField("city", e.target.value)} required />
                    <Field label="State *" value={billing.state} onChange={(e) => setBillingField("state", e.target.value)} required />
                    <Field
                      label="Pincode *"
                      value={billing.pincode}
                      onChange={(e) => setBillingField("pincode", e.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      required
                    />
                    <Field label="Country" value={billing.country} onChange={(e) => setBillingField("country", e.target.value)} />
                  </div>
                )}

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <Field
                    label="GST number (optional)"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  />
                  <Field
                    label="Order notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </section>
            </div>

            {/* Order summary */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-fit rounded-2xl border border-ink/8 bg-white p-6 lg:sticky lg:top-28"
            >
              <h2 className="font-display text-lg font-bold text-ink">Order Summary</h2>

              <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-lg bg-[#F5F3EF] object-contain p-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-ink/40">Qty {item.qty}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                      {formatINR((item.price ?? 0) * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-ink/8 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/50">Subtotal ({count} {count === 1 ? "item" : "items"})</dt>
                  <dd className="font-semibold tabular-nums text-ink">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/50">Shipping</dt>
                  <dd className="font-semibold text-green-700">Free</dd>
                </div>
                <div className="!mt-5 flex justify-between border-t border-ink/8 pt-4">
                  <dt className="font-display text-base font-bold text-ink">Total</dt>
                  <dd className="font-display text-xl font-extrabold tabular-nums text-ink">
                    {formatINR(subtotal)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rust px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-rust/90 hover:shadow-[0_4px_18px_-2px_rgba(224,92,42,0.45)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing order…
                  </>
                ) : (
                  <>
                    Place order
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink/40">
                <Lock className="h-3 w-3" />
                Cash on delivery · Prices include all taxes
              </p>
            </motion.aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}