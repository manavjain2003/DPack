"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Tag,
} from "lucide-react";
import {
  useCart,
  updateQty,
  removeFromCart,
  cartCount,
  cartSubtotal,
  cartSavings,
  formatINR,
} from "@/lib/cartBus";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const items = useCart();
  const subtotal = cartSubtotal(items);
  const savings = cartSavings(items);
  const count = cartCount(items);

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-cream pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>

          <h1 className="mt-3 font-display text-3xl font-extrabold text-ink sm:text-4xl">
            Your Cart
          </h1>
          <p className="mt-1.5 text-sm text-ink/50">
            {count === 0
              ? "Nothing here yet"
              : `${count} ${count === 1 ? "item" : "items"}`}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-14 flex flex-col items-center rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-20 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-rust/10">
              <ShoppingBag className="h-7 w-7 text-rust" />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold text-ink">
              Your cart is empty
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/50">
              Browse our products and add something you like — it will show up
              here.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-rust px-6 py-3 text-sm font-bold text-white transition-all hover:bg-rust/90 hover:shadow-[0_4px_18px_-2px_rgba(224,92,42,0.45)] active:scale-[0.97]"
            >
              Browse products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-4 overflow-hidden rounded-2xl border border-ink/8 bg-white p-4 sm:gap-5 sm:p-5"
                  >
                    <Link
                      href="/products"
                      className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#F5F3EF] sm:h-28 sm:w-28"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-3"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-rust">
                            {item.category}
                          </span>
                          <h3 className="mt-0.5 truncate font-display text-[15px] font-bold leading-tight text-ink">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          aria-label={`Remove ${item.name}`}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/35 transition-colors hover:bg-rust/10 hover:text-rust"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                        <div className="inline-flex items-center rounded-full border border-ink/12">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink/60 transition-colors hover:text-ink"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold tabular-nums text-ink">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid h-8 w-8 place-items-center rounded-full text-ink/60 transition-colors hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="text-right leading-none">
                          {item.compareAtPrice != null &&
                            item.compareAtPrice > item.price && (
                              <span className="block text-[11px] tabular-nums text-ink/35 line-through">
                                {formatINR(item.compareAtPrice * item.qty)}
                              </span>
                            )}
                          <span className="mt-1 block font-display text-lg font-extrabold tabular-nums text-ink">
                            {formatINR((item.price ?? 0) * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="h-fit rounded-2xl border border-ink/8 bg-white p-6 lg:sticky lg:top-28"
            >
              <h2 className="font-display text-lg font-bold text-ink">
                Order Summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/50">
                    Subtotal ({count} {count === 1 ? "item" : "items"})
                  </dt>
                  <dd className="font-semibold tabular-nums text-ink">
                    {formatINR(subtotal)}
                  </dd>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-rust">
                    <dt className="inline-flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      You save
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      −{formatINR(savings)}
                    </dd>
                  </div>
                )}

                <div className="flex justify-between">
                  <dt className="text-ink/50">Shipping</dt>
                  <dd className="font-semibold text-green-700">Free</dd>
                </div>

                <div className="!mt-5 flex justify-between border-t border-ink/8 pt-4">
                  <dt className="font-display text-base font-bold text-ink">
                    Total
                  </dt>
                  <dd className="font-display text-xl font-extrabold tabular-nums text-ink">
                    {formatINR(subtotal)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-rust px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-rust/90 hover:shadow-[0_4px_18px_-2px_rgba(224,92,42,0.45)] active:scale-[0.97]"
              >
                Proceed to checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink/40">
                <Lock className="h-3 w-3" />
                Secure checkout · Prices include all taxes
              </p>
            </motion.aside>
          </div>
        )}
      </div>
    </main>
    <Footer/>
    </>
  );
}