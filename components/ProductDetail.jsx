"use client";

import { useState, useCallback } from "react";
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
  Play,
  CreditCard,
  RefreshCw,
  MapPin,
  Package,
  Leaf,
  Layers,
  Zap,
  Building2,
} from "lucide-react";
import { addToCart } from "@/lib/cartBus";
import { useAuth } from "@/app/context/AuthContext";
import { getPrimaryVideo, getYouTubeEmbedUrl, getInstagramEmbedUrl, getYouTubeId } from "@/lib/videoLinks";


const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


function formatPrice(price) {
  if (price == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function parseSpec(specString) {
  const colonIdx = specString.indexOf(":");
  if (colonIdx !== -1) {
    return {
      label: specString.slice(0, colonIdx).trim(),
      value: specString.slice(colonIdx + 1).trim(),
    };
  }
  return { label: "Detail", value: specString };
}

function buildSpecRows(product) {
  const rows = [];

  if (product.sizes?.length) {
    rows.push({ label: "Available Sizes", value: product.sizes.join(", ") });
  }

  if (product.specs?.length) {
    product.specs.forEach((s) => {
      rows.push(parseSpec(s));
    });
  }

  rows.push(
    { label: "Country of Origin", value: product.countryOfOrigin ?? "Made in India" },
    { label: "Usage / Application", value: product.category ?? "—" },
    { label: "Waterproof", value: product.waterproof ?? "Yes" }
  );

  return rows;
}


const TRUST_BADGES = [
  { Icon: CreditCard, text: "Secure Payments" },
  { Icon: RefreshCw,  text: "Easy Returns"    },
  { Icon: MapPin,     text: "Pan India Delivery" },
];

const TRUST_POINTS = [
  { Icon: ShieldCheck, text: "Quality checked before dispatch"    },
  { Icon: Truck,       text: "Same-day dispatch on bulk orders"   },
  { Icon: RotateCcw,   text: "Easy replacement for damaged items" },
];

const SOCIALS = [
  { href: "https://www.facebook.com/Dpacksolutions/",          Icon: Facebook,  label: "Facebook"  },
  { href: "https://www.instagram.com/dpacksolutionsindia/",    Icon: Instagram, label: "Instagram" },
  { href: "https://www.youtube.com/@Dpacksolutions",           Icon: Youtube,   label: "YouTube"   },
  { href: "https://www.linkedin.com/company/dpacksolutions/",  Icon: Linkedin,  label: "LinkedIn"  },
];

const FEATURE_ICON_MAP = {
  Package,
  Leaf,
  Layers,
  Zap,
  Building2,
  ShieldCheck,
  Truck,
};

const PROMO_STATS = [
  { value: "10K+",      label: "Businesses Trust Us" },
  { value: "99%",       label: "Damage Reduction"    },
  { value: "Pan India", label: "Delivery"            },
];


function PromoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl border border-ink/8 bg-[#F3EEE8] p-7"
    >
      <img
        src="/promo.jpg"
        alt="Safely packaged products"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-white/20" />

      <div className="relative z-10 max-w-[220px]">
        <h3 className="font-display text-[22px] font-bold leading-tight text-ink">
          Safe Products.
          <br />
          Happy Customers.
        </h3>
        <p className="mt-2 text-[13px] leading-snug text-ink/55">
          Because every product deserves to reach safely.
        </p>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
        {PROMO_STATS.map(({ value, label }) => (
          <div key={label}>
            <p className="font-display text-base font-extrabold leading-none text-ink sm:text-lg">
              {value}
            </p>
            <p className="mt-1 text-[10.5px] leading-snug text-ink/45">
              {label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Gallery({ product }) {
  const images = [product.image, ...(product.extraImages ?? [])].filter(Boolean);
  // YouTube and Instagram links are both optional; YouTube wins when both are set.
  const primaryVideo = getPrimaryVideo(product);
  const videoEmbedSrc =
    primaryVideo?.type === "youtube"
      ? getYouTubeEmbedUrl(primaryVideo.url, { autoplay: true, muted: false, controls: true })
      : primaryVideo?.type === "instagram"
      ? getInstagramEmbedUrl(primaryVideo.url)
      : null;
  const media = [
    ...images.map((src) => ({ type: "image", src })),
    ...(videoEmbedSrc
      ? [{ type: "video", src: videoEmbedSrc, videoType: primaryVideo.type }]
      : []),
  ];

  const [active, setActive] = useState(0);
  const activeItem = media[active] ?? media[0];

  const prev = () => setActive((i) => (i - 1 + media.length) % media.length);
  const next = () => setActive((i) => (i + 1) % media.length);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="flex flex-col gap-3"
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-ink/8 bg-[#F5F3EF]"
        style={{ aspectRatio: "4/3" }}
      >
        {product.badges?.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
            {product.badges.map((badge, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${
                  i === 0
                    ? "bg-ink text-white"
                    : "border border-ink/15 bg-white/90 text-ink/70 backdrop-blur-sm"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {activeItem?.type === "image" ? (
            <motion.img
              key={activeItem.src}
              src={activeItem.src}
              alt={product.name}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 h-full w-full object-fill"
            />
          ) : (
            <motion.div
              key="product-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 flex items-center justify-center bg-black"
            >
              <iframe
                src={activeItem.src}
                title={`${product.name} video`}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {media.length > 1 && (
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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {media.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-[80px] w-[80px] shrink-0 overflow-hidden rounded-xl border-2 transition-all bg-[#F5F3EF] ${
              i === active
                ? "border-rust shadow-[0_0_0_2px_rgba(224,92,42,0.20)]"
                : "border-ink/10 hover:border-ink/25"
            }`}
          >
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={`${product.name} ${i + 1}`}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <div className="relative h-full w-full bg-ink">
                {item.videoType === "youtube" ? (
                  <img
                    src={`https://img.youtube.com/vi/${getYouTubeId(primaryVideo.url)}/hqdefault.jpg`}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/70">
                    <Instagram className="h-6 w-6" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow">
                    <Play className="h-3 w-3 fill-rust text-rust" />
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const HARDCODED_FEATURES = [
  { icon: "Package",   title: "Hassle-Free Support",  subtitle: "Get assistance for product selection, setup, and queries." },
  { icon: "Leaf",      title: "Expert Guidance",       subtitle: "Our team provides complete technical consultation." },
  { icon: "Layers",    title: "Reliable Solutions",    subtitle: "High-quality machines designed for long-term performance." },
  { icon: "Zap",       title: "High Strength",         subtitle: "Durable & reliable for heavy-duty use." },
  { icon: "Building2", title: "Multi-Industry Use",    subtitle: "E-commerce, industrial and more." },
];

function FeatureStrip({ features }) {
  const items = features?.length ? features : HARDCODED_FEATURES;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-60px" }}
      className="mt-10 overflow-hidden rounded-2xl border border-ink/8 bg-[#F9F8F6]"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-ink/8">
        {items.map(({ icon, title, subtitle }, idx) => {
          const Icon = FEATURE_ICON_MAP[icon] ?? Package;
          return (
            <motion.div
              key={title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center justify-start gap-3 px-6 py-7 text-center
                ${idx >= 2 ? "sm:border-t-0" : ""}
                ${idx >= 3 ? "border-t border-ink/8 sm:border-t lg:border-t-0" : ""}
              `}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-white shadow-sm">
                <Icon className="h-5 w-5 text-ink/50" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-ink/45">{subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function BulletSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="mb-2.5 text-[15px] font-bold text-ink">{title}</h4>
      <ul className="space-y-2">
        {items.map((line, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink/65">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
            {line}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function TabDescription({ product }) {
  const bullets = product.descriptionBullets ?? [];
  return (
    <div className="space-y-6">
      {bullets.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
          className="space-y-3"
        >
          {bullets.map((line, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/65"
            >
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-rust" style={{ width: 18, height: 18 }} />
              {line}
            </motion.p>
          ))}
        </motion.div>
      )}

      <BulletSection title="Product Overview" items={product.overview} />
      <BulletSection title="Key Features" items={product.keyFeatures} />
      <BulletSection title="Applications" items={product.applications} />
    </div>
  );
}

function TabSpecifications({ product }) {
  const specRows = buildSpecRows(product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="overflow-hidden rounded-2xl border border-ink/8"
    >
      <table className="w-full text-[15px]">
        <tbody>
          {specRows.map(({ label, value }, i) => (
            <tr
              key={`${label}-${i}`}
              className={`border-b border-ink/6 last:border-0 ${
                i % 2 === 0 ? "bg-[#FAFAF9]" : "bg-white"
              }`}
            >
              <td className="w-48 px-5 py-3.5 font-semibold text-ink/50">{label}</td>
              <td className="px-5 py-3.5 font-medium text-ink/80">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

function TabShipping({ product }) {
  const rows = product.shippingInfo ?? [
    { label: "Dispatch Time",    value: "1–2 business days" },
    { label: "Shipping Partner", value: "Pan India — all major couriers" },
    { label: "Bulk Orders",      value: "Same-day dispatch available" },
    { label: "Returns",          value: "Easy replacement for damaged items within 7 days" },
    { label: "Payment",          value: "Secure checkout — UPI, cards, net banking" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="overflow-hidden rounded-2xl border border-ink/8"
    >
      <table className="w-full text-[15px]">
        <tbody>
          {rows.map(({ label, value }, i) => (
            <tr
              key={label}
              className={`border-b border-ink/6 last:border-0 ${
                i % 2 === 0 ? "bg-[#FAFAF9]" : "bg-white"
              }`}
            >
              <td className="w-48 px-5 py-3.5 font-semibold text-ink/50">{label}</td>
              <td className="px-5 py-3.5 font-medium text-ink/80">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

const TABS = [
  { id: "description",    label: "Product Details"    },
  { id: "specifications", label: "Specifications"     },
  { id: "shipping",       label: "Shipping & Returns" },
];

function ProductTabs({ product }) {
  const [active, setActive] = useState("description");

  const reviewCount = product.reviewCount ?? 0;
  const tabs = TABS.map((t) =>
    t.id === "reviews" && reviewCount > 0
      ? { ...t, label: `Reviews (${reviewCount})` }
      : t
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mt-14"
    >
      <div className="flex gap-8 border-b border-ink/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`relative pb-4 text-[16px] font-bold transition-colors whitespace-nowrap ${
              active === tab.id ? "text-ink" : "text-ink/35 hover:text-ink/55"
            }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-rust" />
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-8 py-9 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {active === "description"    && <TabDescription    product={product} />}
          {active === "specifications" && <TabSpecifications product={product} />}
          {active === "shipping"       && <TabShipping       product={product} />}
          {active === "reviews"        && (
            <p className="text-[15px] text-ink/45">Reviews section coming soon.</p>
          )}
        </div>

        <PromoPanel />
      </div>
    </motion.div>
  );
}

export default function ProductDetail({ product }) {
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [wishAnim, setWishAnim] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? null);

  const { isWishlisted, toggleWishlist } = useAuth();
  const wishlisted = product?.id ? isWishlisted(product.id) : false;

  const outOfStock = product.trackInventory !== false && (product.stock ?? 0) <= 0;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = useCallback(() => {
    if (outOfStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }, [product, qty, outOfStock]);

  const handleWishlist = useCallback(() => {
    const result = toggleWishlist(product);
    if (result.added) {
      setWishAnim(true);
      setTimeout(() => setWishAnim(false), 500);
    }
  }, [product, toggleWishlist]);

  return (
    <div className="w-full" style={{ padding: "0 clamp(24px, 5vw, 96px)" }}>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

<div className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Gallery product={product} />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          className="flex flex-col"
        >
          <motion.span
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="inline-flex w-fit items-center rounded-full border border-rust/25 bg-rust/8 px-3 py-1 text-[11.5px] font-bold uppercase tracking-widest text-rust"
          >
            {product.category}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 font-display text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-[30px]"
          >
            {product.name}
          </motion.h1>

          {product.tagline && (
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-1 text-[13.5px] text-ink/45"
            >
              {product.tagline}
            </motion.p>
          )}

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(product.rating ?? 4)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-ink/10 text-ink/10"
                  }`}
                />
              ))}
            </div>
            {product.rating != null && (
              <span className="text-[12px] font-semibold text-ink/65">
                {product.rating} ({product.reviewCount ?? 0} reviews)
              </span>
            )}
            {product.soldCount && (
              <span className="text-[12px] text-ink/35">| {product.soldCount} sold</span>
            )}
          </motion.div>

          {product.price != null && (
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-5 flex items-end gap-3"
            >
              <span className="font-display text-3xl font-extrabold tabular-nums text-ink">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                <span className="mb-0.5 text-base tabular-nums text-ink/35 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discountPercent && (
                <span className="mb-0.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-[12px] font-bold text-orange-600">
                  {discountPercent}% OFF
                </span>
              )}
            </motion.div>
          )}

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-4 text-[14px] leading-relaxed text-ink/60"
          >
            {product.description}
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.45 }} className="mt-5 h-px bg-ink/8" />

          {product.sizes?.length > 0 && (
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-5">
              <p className="mb-2.5 text-[13px] font-semibold text-ink/70">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-all ${
                      selectedSize === size
                        ? "border-ink bg-ink text-white"
                        : "border-ink/15 bg-white text-ink/65 hover:border-ink/35"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-5 flex flex-wrap items-center gap-5"
          >
            <div>
              <p className="mb-2.5 text-[13px] font-semibold text-ink/70">Quantity</p>
              <div className="flex items-center rounded-lg border border-ink/12">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={qty <= 1 || outOfStock}
                  className="flex h-10 w-10 items-center justify-center text-ink/60 transition hover:text-ink disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-[15px] font-bold tabular-nums text-ink">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  disabled={outOfStock}
                  className="flex h-10 w-10 items-center justify-center text-ink/60 transition hover:text-ink disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-auto pb-0.5">
              {outOfStock ? (
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Out of Stock
                </span>
              ) : (
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    In Stock
                  </span>
                  <p className="text-[12px] text-ink/40">Ready to ship</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-5 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              aria-disabled={outOfStock}
              className={`relative inline-flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold text-white transition-colors duration-300 active:scale-[0.98] ${
                outOfStock
                  ? "cursor-not-allowed bg-ink/25 active:scale-100"
                  : added
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-ink hover:bg-ink/85"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {outOfStock ? (
                  <motion.span key="oos" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">
                    Out of stock
                  </motion.span>
                ) : added ? (
                  <motion.span key="added" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Added to cart
                  </motion.span>
                ) : (
                  <motion.span key="cart" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                wishlisted
                  ? "border-rust bg-rust text-white shadow-[0_4px_14px_-2px_rgba(224,92,42,0.45)]"
                  : "border-ink/12 text-ink/50 hover:border-rust/40 hover:text-rust"
              }`}
            >
              <motion.span animate={wishAnim ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} strokeWidth={wishlisted ? 0 : 2} />
              </motion.span>
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-5 flex flex-wrap items-center gap-5 border-t border-ink/8 pt-4"
          >
            {TRUST_BADGES.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-ink/50">
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span className="text-[12.5px] font-medium">{text}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-4 text-[13px] text-ink/45"
          >
            Need a custom quantity or specification?{" "}
            <Link href="/contact" className="font-semibold text-rust underline-offset-4 hover:underline">
              Talk to our team
            </Link>
            .
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-40px" }}
            className="mt-6 grid gap-3 sm:grid-cols-3"
          >
            {TRUST_POINTS.map(({ Icon, text }) => (
              <motion.div
                key={text}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                className="flex items-start gap-2.5 rounded-xl border border-ink/8 bg-[#F9F7F4] px-3.5 py-3"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
                <span className="text-[12.5px] leading-snug text-ink/65">{text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.45 }} className="mt-7 h-px bg-ink/8" />

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-5 flex flex-wrap items-center gap-3"
          >
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
            <button
              type="button"
              className="ml-auto flex items-center gap-1.5 text-[12px] text-ink/35 hover:text-ink/55 transition"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
          </motion.div>
        </motion.div>
      </div>

      <FeatureStrip features={product.features} />
      <ProductTabs product={product} />
    </div>
  );
}