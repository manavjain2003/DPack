"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Check,
  Zap,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { addToCart } from "@/lib/cartBus";
import { useAuth } from "@/app/context/AuthContext";

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Quality checked before dispatch" },
  { icon: Truck, text: "Same-day dispatch on bulk orders" },
  { icon: RotateCcw, text: "Easy replacement for damaged items" },
];

function formatPrice(price) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductDetail({ product }) {
  const [hovered, setHovered] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);
  const videoRef = useRef(null);

  const { isWishlisted, toggleWishlist } = useAuth();
  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  const handleMouseEnter = useCallback(() => {
    if (!product.videoSrc) return;
    setHovered(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 50);
  }, [product.videoSrc]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  const handleAddToCart = useCallback(() => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }, [product, qty]);

  const handleWishlist = useCallback(() => {
    const result = toggleWishlist(product);
    if (result.added) {
      setWishAnim(true);
      setTimeout(() => setWishAnim(false), 500);
    }
  }, [product, toggleWishlist]);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Media */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-square overflow-hidden rounded-3xl border border-ink/8 bg-[#F5F3EF]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(245,243,239,0)_100%)]" />

        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 m-auto h-full w-full object-fill p-10 transition-all duration-500 ${
            hovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />

        {product.videoSrc && (
          <video
            ref={videoRef}
            src={product.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-400 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-cream">
          {product.category}
        </span>

        {discountPercent && (
          <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-rust px-3 py-1.5 text-[10px] font-bold text-white">
            <Zap className="h-3 w-3" />
            {discountPercent}% off
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-4 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
            wishlisted
              ? "border-rust/30 bg-rust text-white shadow-[0_4px_14px_-2px_rgba(224,92,42,0.45)]"
              : "border-white/20 bg-black/45 text-white backdrop-blur-md hover:bg-black/60"
          }`}
        >
          <motion.span
            animate={wishAnim ? { scale: [1, 1.35, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`}
              strokeWidth={wishlisted ? 0 : 2}
            />
          </motion.span>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          {product.name}
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
          {product.description}
        </p>

        {product.price != null && (
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-3xl font-extrabold tabular-nums text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice != null &&
              product.compareAtPrice > product.price && (
                <span className="mb-0.5 text-base tabular-nums text-ink/35 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/40">
              Available sizes
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-ink/5 px-3 py-1.5 text-[13px] font-semibold text-ink/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.specs?.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/40">
              Key specs
            </p>
            <div className="flex flex-wrap gap-2">
              {product.specs.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink/10 px-3 py-1.5 text-[13px] font-medium text-ink/60"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 h-px w-full bg-ink/8" />

        {/* Qty + Add to cart */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-ink/12">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="flex h-11 w-11 items-center justify-center text-ink/60 transition hover:text-ink disabled:opacity-30"
              disabled={qty <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-[15px] font-bold tabular-nums text-ink">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="flex h-11 w-11 items-center justify-center text-ink/60 transition hover:text-ink"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`relative inline-flex flex-1 min-w-[180px] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold text-white transition-colors duration-300 active:scale-[0.98] ${
              added
                ? "bg-green-600 hover:bg-green-700"
                : "bg-rust hover:bg-rust/90 hover:shadow-[0_4px_18px_-2px_rgba(224,92,42,0.45)]"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ scale: 0.7, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Added to cart
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0.7, opacity: 0, y: 4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <p className="mt-4 text-[13px] text-ink/45">
          Need a custom quantity or specification?{" "}
          <Link
            href="/contact"
            className="font-semibold text-rust underline-offset-4 hover:underline"
          >
            Talk to our team
          </Link>
          .
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {TRUST_POINTS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-2.5 rounded-xl border border-ink/8 bg-[#F9F7F4] px-3.5 py-3"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
              <span className="text-[12.5px] leading-snug text-ink/65">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}