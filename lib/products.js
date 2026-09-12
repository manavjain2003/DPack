const rawProducts = [
  {
    slug: "corrugation-shredder-machine",
    name: "Cardboard Corrugation Shredder Machine",
    category: "Machines",
    description:
      "Turns waste cardboard into free, eco-friendly cushioning mat — cut disposal costs and never buy void fill again.",
    specs: ["Heavy-duty cutters", "Eco void-fill output"],
    image: "/images/shredder-machine.png",
    price: 185000,
    featured: true,
  },
  {
    slug: "air-cushion-machine",
    name: "Air Cushion Machine",
    category: "Machines",
    description:
      "The smart replacement for traditional bubble wrap rolls — produces air cushions on demand, right at your packing station.",
    specs: ["On-demand cushions", "Low film cost"],
    image: "/images/air-cushion-machine.png",
    price: 95000,
    featured: true,
  },
  {
    slug: "air-cushion-film-roll",
    name: "Air Cushion Film Roll",
    category: "Films & Rolls",
    description:
      "Compatible film rolls for air cushion machines — continuous cushioning for high-volume packing lines.",
    specs: ["200 mm × 300 mm", "200 m · 3 pouches/m"],
    image: "/images/air-cushion-roll.png",
    price: 3200,
    featured: false,
  },
  {
    slug: "air-column-bags",
    name: "Air Column Bags",
    category: "Void Fill",
    description:
      "Protective air bags for safe & secure packaging — keep your shipments safe with self-inflated, shock-absorbing columns.",
    specs: ["7 sizes in stock", "120 mm → 240 mm widths"],
    sizes: [
      "120×180 · 85 pcs",
      "180×230 · 90 pcs",
      "210×300 · 52 pcs",
      "210×330 · 42 pcs",
      "210×375 · 38 pcs",
      "240×375 · 35 pcs",
      "240×415 · 28 pcs",
    ],
    image: "/images/air-column-bags.png",
    price: 1450,
    featured: true,
  },
  {
    slug: "gap-fillers",
    name: "Gap Fillers",
    category: "Void Fill",
    description:
      "Lightweight inflatable pillows that fill empty space in cartons and stop goods from shifting in transit.",
    specs: ["100 mm × 200 mm", "260 pcs per pack"],
    image: "/images/gap-filler.png",
    price: 890,
    featured: false,
  },
  {
    slug: "air-bags",
    name: "Air Bags",
    category: "Void Fill",
    description:
      "Lightweight inflatable air bags designed to fill empty spaces inside cartons and provide reliable protection during transportation.",
    specs: ["Lightweight protection", "Fast inflation"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGTgYpLetPCyCtUR9Yhbsxv00YbXL3FjDJVeD1gMmhhw&s=10",
    price: 1200,
    featured: true,
  },
  {
    slug: "e-commerce-pouches",
    name: "E-commerce Pouches",
    category: "Pouches",
    description:
      "Durable mailing pouches designed for fast, secure e-commerce fulfilment and everyday parcel shipping.",
    specs: ["Tamper resistant", "Lightweight design"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcUN7ONXXiU0JD6SC5lrP3biKxqiG65OpmMNnRalEfvw&s=10",
    price: 6.5, 
    featured: false,
  },
  {
    slug: "pallet-belts",
    name: "Reusable Pallet Belts",
    category: "Securing",
    description:
      "Secure your shipments with confidence — heavy-duty hook-and-loop belts that stabilize stacked cartons on pallets.",
    specs: ["6 m length", "100 mm width"],
    image: "/images/pallet-belt.png",
    price: 780,
    featured: false,
  },
  {
    slug: "ratchet-belts",
    name: "Ratchet Belts",
    category: "Securing",
    description:
      "Heavy-duty load securing belts with ratchet tensioning for safely stabilizing pallets, cartons and industrial loads.",
    specs: ["Heavy-duty webbing", "Ratchet tensioning"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPthMe5gLNejopYpFpRLNOeI5tGoGhx2ialGqYNmwdKQ&s=10",
    price: 450,
    featured: false,
  },
  {
    slug: "lashing-systems",
    name: "Lashing Systems",
    category: "Securing",
    description:
      "Reliable cargo lashing solutions for securing goods during transport, handling and storage.",
    specs: ["Cargo securing", "High-strength webbing"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV9Uy24EsHPmdZJ7Pk7OiNJvCbXEUrEySou6xmVQsTRg&s",
    price: 2100,
    featured: false,
  },
  {
    slug: "honeycomb-sleeve",
    name: "Honeycomb Sleeves",
    category: "Wrap",
    description:
      "Stretchy kraft honeycomb that hugs bottles, jars and delicate surfaces — plastic-free protective wrap.",
    specs: ["Kraft paper", "Multiple lengths"],
    image: "/images/honeycomb-sleeve.png",
    price: 1100,
    featured: true,
  },
  {
    slug: "air-bubble-roll",
    name: "Air Bubble Roll",
    category: "Wrap",
    description:
      "Self-inflated air bubble wrap — best for packing fragile items, with no pump required.",
    specs: ["440 mm width", "Self-inflating"],
    image: "/images/bubble-roll.png",
    price: 1650,
    featured: false,
  },
  {
    slug: "bubble-wrap",
    name: "Bubble Wrap",
    category: "Wrap",
    description:
      "Flexible protective bubble wrap for cushioning fragile products and preventing scratches, dents and impact damage.",
    specs: ["Impact cushioning", "Flexible protection"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHRgTMOvJdYxm0FFiTMqQJE5MxYmwoWS-o4g4376TtuA&s=10",
    price: 980,
    featured: false,
  },
  {
    slug: "buckles-hooks",
    name: "Buckles & Hooks",
    category: "Securing",
    description:
      "Practical buckles and hooks for fastening, securing and organizing packaging straps across a range of applications.",
    specs: ["Easy fastening", "Multiple applications"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn4vBglhg9clraJVHUfs-eH7wcd3Z8-CQ9On087hZZBw&s=10",
    price: 35,
    featured: false,
  },
  {
    slug: "composite-straps",
    name: "Composite Straps",
    category: "Strapping",
    description:
      "Strong and flexible composite strapping for securing heavy loads while providing dependable tension and holding strength.",
    specs: ["High tensile strength", "Flexible handling"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGTgYpLetPCyCtUR9Yhbsxv00YbXL3FjDJVeD1gMmhhw&s=10",
    price: 2200,
    featured: true,
  },
  {
    slug: "cord-straps",
    name: "Cord Straps",
    category: "Strapping",
    description:
      "Lightweight yet strong cord strapping for securing cartons, pallets and irregular loads during transportation.",
    specs: ["Lightweight", "High load security"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStj3r9ktKk8rAh_V03oai0B98ZeV_hYanPJUkjoc4t2w&s=10",
    price: 950,
    featured: false,
  },
  {
    slug: "dunnage-paper",
    name: "Dunnage Paper",
    category: "Void Fill",
    description:
      "Paper-based protective dunnage for filling empty spaces, cushioning products and reducing movement inside cartons.",
    specs: ["Paper-based", "Eco-friendly void fill"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWWxYdmnVysouHU8lFmWfHEU7bYv0Yfsfg6OeXnP1mqg&s=10",
    price: 680,
    featured: true,
  },
  {
    slug: "pp-bags",
    name: "PP Bags",
    category: "Bags",
    description:
      "Durable polypropylene bags for packaging, protecting and transporting a wide range of commercial and industrial products.",
    specs: ["Durable PP material", "Reusable options"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkwHkUCSecXTjFlT_rzCN_dejeVQrFEO9T88-DRPPf9w&s=10",
    price: 12,
    featured: false,
  },
  {
    slug: "packaging-tapes",
    name: "Packaging Tapes",
    category: "Tapes",
    description:
      "Reliable packaging tapes for securely sealing cartons and parcels throughout storage, handling and transportation.",
    specs: ["Strong adhesion", "Carton sealing"],
    image: "/images/packaging-tape.png",
    price: 85,
    featured: false,
  },
  {
    slug: "corrugated-boxes",
    name: "3 Ply Corrugated Boxes",
    category: "Boxes",
    description:
      "Sturdy single-wall cartons in multiple sizes — the dependable outer layer for every shipment.",
    specs: ["3 ply single wall", "Multiple sizes"],
    image: "/images/corrugated-box.png",
    price: 28,
    featured: false,
  },
];

// Every product needs a stable unique `id` (wishlist, cart and product-card
// logic all key off `product.id`). Products previously only had `slug`, so
// `product.id` was always `undefined` and the wishlist heart button silently
// did nothing. Derive `id` from `slug` here so it's guaranteed everywhere.
export const products = rawProducts.map((p) => ({ id: p.slug, ...p }));

// Look up a single product by its slug (used by the product detail page).
export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) ?? null;
}

// Other products in the same category, for a "You might also like" rail.
export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, limit);
}

export const categories = [
  "All",
  "Machines",
  "Films & Rolls",
  "Void Fill",
  "Wrap",
  "Securing",
  "Boxes",
];

export const fullRange = [
  "Air Column Bags",
  "Gap Fillers",
  "Air Bags",
  "E-commerce Pouches",
  "Ratchet Belts",
  "Lashing Systems",
  "Bubble Wrap",
  "Buckles & Hooks",
  "Composite Straps",
  "Cord Straps",
  "Dunnage Paper",
  "PP Bags",
  "Packaging Tapes",
];

export const stats = [
  { value: 14, suffix: "+", label: "Product categories under one roof" },
  { value: 7, suffix: "", label: "Air column bag sizes in stock" },
  { value: 200, suffix: " m", label: "Air cushion film per roll" },
  { value: 6, suffix: " m", label: "Reusable pallet belt length" },
];

export const EMAIL = "info@dpacksolutions.com";