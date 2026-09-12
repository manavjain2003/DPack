"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShoppingCart,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { addToCart } from "@/lib/cartBus";
import { useAuth } from "@/app/context/AuthContext";

/* ── helpers ──────────────────────────────────────────────── */
function formatPrice(price) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

const TRUST_POINTS = [
  { icon: ShieldCheck, text: "Quality checked before dispatch" },
  { icon: Truck, text: "Same-day dispatch on bulk orders" },
  { icon: RotateCcw, text: "Easy replacement for damaged items" },
];

/* ── derive spec rows from the product object ─────────────── */
function buildSpecRows(product) {
  const rows = [];
  if (product.sizes?.length)
    rows.push({ label: "Available Sizes", value: product.sizes.join(", ") });
  if (product.specs?.length)
    rows.push(
      ...product.specs.map((s, i) => ({
        label: `Specification ${i + 1}`,
        value: s,
      }))
    );
  rows.push(
    { label: "Country of Origin", value: "Made in India" },
    { label: "Usage / Application", value: product.category },
    { label: "Waterproof", value: "Yes" }
  );
  return rows;
}

/* ── social links ─────────────────────────────────────────── */
const SOCIALS = [
  { href: "https://www.facebook.com/Dpacksolutions/", Icon: Facebook, label: "Facebook" },
  { href: "https://www.instagram.com/dpacksolutionsindia/", Icon: Instagram, label: "Instagram" },
  { href: "https://www.youtube.com/@Dpacksolutions", Icon: Youtube, label: "YouTube" },
  { href: "https://www.linkedin.com/company/dpacksolutions/", Icon: Linkedin, label: "LinkedIn" },
];

/* ── image gallery ────────────────────────────────────────── */
function Gallery({ product }) {
  const images = [product.image, ...(product.extraImages ?? [])].filter(Boolean);
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink/8 bg-[#F5F3EF]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_100%)] pointer-events-none z-10" />

        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[active]}
            src={images[active]}
            alt={product.name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 h-full w-full object-fill"
          />
        </AnimatePresence>

        {/* 360 badge */}
        <span className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink/60 backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" />
          360° View
        </span>

        {/* arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm border border-ink/8 text-ink/60 hover:bg-white transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm border border-ink/8 text-ink/60 hover:bg-white transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2.5 overflow-x-auto pb-0.5">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-[#F5F3EF] ${
              i === active
                ? "border-rust shadow-[0_0_0_2px_rgba(224,92,42,0.20)]"
                : "border-ink/10 hover:border-ink/25"
            }`}
          >
            <img
              src={src}
              alt={`${product.name} ${i + 1}`}
              className="h-full w-full object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── tabs ─────────────────────────────────────────────────── */
const TABS = [
  { id: "description", label: "Description" },
  { id: "additional", label: "Additional Info" },
];

function TabDescription({ product }) {
  const overview = [
    `High-quality ${product.name} designed to secure cargo and prevent movement during transportation, ensuring safe and damage-free delivery.`,
    "Provides excellent strength and cushioning performance ideal for filling voids between cargo.",
    "Suitable for use in containers, trucks, and rail wagons — covering a wide range of logistics and industrial applications.",
    "A cost-effective packaging solution widely used across various industries.",
  ];

  const features = [
    "Strong Construction: Made with durable materials that provide high strength and reliable load support during transit.",
    "Effective Load Stabilization: Helps in securely filling gaps between cargo, preventing movement, shifting, and damage.",
    "Easy to Use & Install: Simple placement process reduces manual effort and improves packaging efficiency.",
    "Eco-Friendly Packaging Solution: Designed with sustainability in mind.",
    ...(product.specs ?? []).map((s) => `${s}: built to specification.`),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-[17px] font-bold text-ink">Product Overview</h3>
        <ul className="space-y-2.5 list-none pl-0">
          {overview.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] text-ink/65 leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-4 text-[17px] font-bold text-ink">Key Features</h3>
        <ul className="space-y-2.5 list-none pl-0">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[14px] text-ink/65 leading-relaxed">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TabAdditional({ product }) {
  const rows = buildSpecRows(product);
  return (
    <div className="overflow-hidden rounded-xl border border-ink/8">
      <table className="w-full text-[14px]">
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr key={label} className={i % 2 === 0 ? "bg-[#F9F7F4]" : "bg-white"}>
              <td className="w-44 px-5 py-3.5 font-semibold text-ink/55 sm:w-56">{label}</td>
              <td className="px-5 py-3.5 text-ink/80">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductTabs({ product }) {
  const [active, setActive] = useState("description");
  return (
    <div className="mt-14 border-t border-ink/8 pt-10">
      <div className="flex gap-1 border-b border-ink/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`relative px-5 py-3 text-[13.5px] font-semibold tracking-wide transition-colors ${
              active === tab.id ? "text-ink" : "text-ink/40 hover:text-ink/70"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t-full bg-rust" />
            )}
          </button>
        ))}
      </div>
      <div className="py-8">
        {active === "description" && <TabDescription product={product} />}
        {active === "additional" && <TabAdditional product={product} />}
      </div>
    </div>
  );
}

/* ── main component ───────────────────────────────────────── */
export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishAnim, setWishAnim] = useState(false);

  const { isWishlisted, toggleWishlist } = useAuth();
  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  const specRows = buildSpecRows(product);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;

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
    <div>
      {/* ── Two-column panel ───────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Left — Gallery */}
        <Gallery product={product} />

        {/* Right — Info */}
        <div className="flex flex-col">

          {/* Category badge */}
          <span className="inline-flex w-fit items-center rounded-full border border-rust/25 bg-rust/8 px-3 py-1 text-[11.5px] font-bold uppercase tracking-widest text-rust">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="mt-3 font-display text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[30px]">
            {product.name}
          </h1>

          {/* Stars + reviews */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= 4 ? "fill-amber-400 text-amber-400" : "fill-ink/10 text-ink/10"
                  }`}
                />
              ))}
              <span className="ml-1 text-[12px] text-ink/45">(93 Reviews)</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[12px] font-semibold text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              In Stock
            </span>
          </div>

          {/* Price */}
          {product.price != null && (
            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-3xl font-extrabold tabular-nums text-ink">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                <span className="mb-0.5 text-base tabular-nums text-ink/35 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="mb-0.5 rounded-full bg-green-100 px-2.5 py-0.5 text-[12px] font-bold text-green-700">
                  {discountPercent}% off
                </span>
              )}
            </div>
          )}

          {/* Short description */}
          <p className="mt-4 text-[14px] leading-relaxed text-ink/60">
            {product.description}
          </p>

          {/* Divider */}
          <div className="mt-6 h-px bg-ink/8" />

          {/* Qty + Add to cart + Wishlist */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Qty stepper */}
            <div className="flex items-center rounded-full border border-ink/12">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                className="flex h-11 w-11 items-center justify-center text-ink/60 transition hover:text-ink disabled:opacity-30"
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

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`relative inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold text-white transition-colors duration-300 active:scale-[0.98] ${
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

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                wishlisted
                  ? "border-rust bg-rust text-white shadow-[0_4px_14px_-2px_rgba(224,92,42,0.45)]"
                  : "border-ink/12 bg-transparent text-ink/50 hover:border-rust/40 hover:text-rust"
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

          <p className="mt-4 text-[13px] text-ink/45">
            Need a custom quantity or specification?{" "}
            <Link href="/contact" className="font-semibold text-rust underline-offset-4 hover:underline">
              Talk to our team
            </Link>
            .
          </p>

          {/* Spec table */}
          <div className="mt-7 overflow-hidden rounded-xl border border-ink/8">
            <table className="w-full text-[13.5px]">
              <tbody>
                {specRows.map(({ label, value }, i) => (
                  <tr
                    key={label}
                    className={`border-b border-ink/6 last:border-0 ${
                      i % 2 === 0 ? "bg-[#FAFAF9]" : "bg-white"
                    }`}
                  >
                    <td className="w-36 px-4 py-3 font-semibold text-ink/50 sm:w-44">{label}</td>
                    <td className="px-4 py-3 font-medium text-ink/80">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust points */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-2.5 rounded-xl border border-ink/8 bg-[#F9F7F4] px-3.5 py-3"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
                <span className="text-[12.5px] leading-snug text-ink/65">{text}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-7 h-px bg-ink/8" />

          {/* Social */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-[12.5px] font-semibold text-ink/40">Visit Us:</span>
            {SOCIALS.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-ink/3 text-ink/50 transition hover:border-rust/30 hover:bg-rust/8 hover:text-rust"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
            <span className="ml-auto flex items-center gap-1.5 text-[12px] text-ink/35">
              <Share2 className="h-3 w-3" />
              Share
            </span>
          </div>
        </div>
      </div>

      {/* ── Description / Additional Info tabs ─────────── */}
      <ProductTabs product={product} />
    </div>
  );
}