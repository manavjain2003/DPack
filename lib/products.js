/**
 * Server-side product helpers — used in Next.js Server Components and
 * generateStaticParams. These fetch from the DB at request time.
 * For client components, use apiClient.js → productsAPI instead.
 */
import { connectDB } from "./db/mongoose";
import ProductModel from "./models/Product";
import CategoryModel from "./models/Category";

function buildSlug(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getProducts(filter = {}) {
  await connectDB();
  const products = await ProductModel.find({ isActive: true, ...filter })
    .sort({ createdAt: -1 })
    .lean();
  return products.map(normalise);
}

export async function getFeaturedProducts() {
  return getProducts({ featured: true });
}

export async function getProductBySlug(slug) {
  await connectDB();
  const p = await ProductModel.findOne({ slug, isActive: true }).lean();
  return p ? normalise(p) : null;
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  await connectDB();
  const related = await ProductModel.find({
    category: product.category,
    slug: { $ne: product.slug },
    isActive: true,
  })
    .limit(limit)
    .lean();
  return related.map(normalise);
}

export async function getAllSlugs() {
  await connectDB();
  const docs = await ProductModel.find({ isActive: true }).select("slug").lean();
  return docs.map((d) => d.slug);
}

export async function getCategories() {
  await connectDB();
  const cats = await ProductModel.distinct("category", { isActive: true });
  return ["All", ...cats.sort()];
}

/** Resolve a category's real name from its URL slug (e.g. "films-rolls" -> "Films & Rolls") */
export async function getCategoryBySlug(slug) {
  await connectDB();
  const productNames = await ProductModel.distinct("category", { isActive: true });
  const categoryDocs = await CategoryModel.find({}).lean();
  const allNames = Array.from(new Set([...productNames, ...categoryDocs.map((c) => c.name)]));
  return allNames.find((name) => buildSlug(name) === slug) || null;
}

/** The admin-uploaded image for a category, if one has been set */
export async function getCategoryImage(name) {
  await connectDB();
  const doc = await CategoryModel.findOne({ name }).lean();
  return doc?.image || null;
}

/** Normalise a Mongoose lean doc to the shape the UI expects */
function normalise(p) {
  return {
    ...p,
    id: p._id.toString(),
    _id: p._id.toString(),
    image: p.image || "/images/placeholder.png",
    extraImages: p.extraImages || [],
    specs: p.specs || [],
    sizes: p.sizes || [],
  };
}

// ── Hardcoded fallback data (used until DB is seeded) ────────────────────────
// These legacy exports let server components work before the DB is populated.
export const categories = ["All","Machines","Films & Rolls","Void Fill","Wrap","Securing","Boxes","Tapes"];

export const stats = [
  { value: 14, suffix: "+", label: "Product categories under one roof" },
  { value: 7, suffix: "", label: "Air column bag sizes in stock" },
  { value: 200, suffix: " m", label: "Air cushion film per roll" },
  { value: 6, suffix: " m", label: "Reusable pallet belt length" },
];

export const EMAIL = "info@dpacksolutions.com";
export const products = [];    
export const fullRange = [];