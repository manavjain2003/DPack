"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCart,
  updateQty,
  removeFromCart,
  cartCount,
  cartSubtotal,
  formatINR,
} from "@/lib/cartBus";

export default function CartSidebar() {
  const [open, setOpen] = useState(false);
  const items = useCart();
  const count = cartCount(items);
  const total = cartSubtotal(items);

  // Open sidebar whenever something is added
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cart:added", handler);
    return () => window.removeEventListener("cart:added", handler);
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Floating bag button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream shadow-[0_8px_30px_-4px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_12px_36px_-4px_rgba(0,0,0,0.45)]"
      >
        <ShoppingBag className="h-5 w-5" />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-[10px] font-extrabold text-white"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            {/* Sidebar */}
            <motion.aside
              key="sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.9 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-[#FDFCFA] shadow-[-20px_0_60px_-10px_rgba(0,0,0,0.15)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="h-4 w-4 text-ink/60" />
                  <h2 className="font-display text-[15px] font-bold text-ink">
                    Your cart
                  </h2>
                  {count > 0 && (
                    <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-[11px] font-semibold text-ink/55">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close cart"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/6 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex flex-col items-center justify-center gap-3 pt-24 text-center"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5">
                        <ShoppingBag className="h-7 w-7 text-ink/25" />
                      </span>
                      <p className="text-[14px] font-semibold text-ink/40">
                        Nothing here yet
                      </p>
                      <p className="text-[12px] text-ink/30">
                        Add a product and it’ll show up here.
                      </p>
                    </motion.div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mb-3 flex gap-4 rounded-xl border border-ink/8 bg-white p-3.5"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F5F3EF]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain p-1.5"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-[13px] font-semibold leading-snug text-ink">
                              {item.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.key)}
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 text-ink/25 transition-colors hover:text-rust"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-lg border border-ink/10 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQty(item.key, item.qty - 1)}
                                aria-label="Decrease quantity"
                                className="flex h-6 w-6 items-center justify-center rounded-md text-ink/50 transition-colors hover:bg-ink/6 hover:text-ink"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-[12px] font-bold tabular-nums text-ink">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.key, item.qty + 1)}
                                aria-label="Increase quantity"
                                className="flex h-6 w-6 items-center justify-center rounded-md text-ink/50 transition-colors hover:bg-ink/6 hover:text-ink"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="font-display text-[14px] font-extrabold tabular-nums text-ink">
                              {formatINR(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.22 }}
                    className="border-t border-ink/8 px-6 py-5"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[13px] text-ink/50">Subtotal</span>
                      <span className="font-display text-[18px] font-extrabold tabular-nums text-ink">
                        {formatINR(total)}
                      </span>
                    </div>
                    <p className="mb-4 text-[11px] text-ink/35">
                      Shipping and taxes calculated at checkout.
                    </p>

                    <button
                      type="button"
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[13px] font-bold text-cream transition-all duration-200 hover:bg-ink/85 hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                    >
                      Proceed to checkout
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="mt-2.5 w-full rounded-full py-2.5 text-[12px] font-semibold text-ink/40 transition-colors hover:text-ink"
                    >
                      Continue shopping
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}