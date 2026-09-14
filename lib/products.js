
import { connectDB } from "./db/mongoose";
import ProductModel from "./models/Product";

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