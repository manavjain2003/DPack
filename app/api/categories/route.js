import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { ok, err } from "@/lib/apiHelpers";

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    await connectDB();
    const productNames = await Product.distinct("category", { isActive: true });
    const categoryDocs = await Category.find({}).lean();

    const sorted = Array.from(
      new Set([...productNames, ...categoryDocs.map((c) => c.name)])
    ).sort();

    const categoryImages = {};
    for (const c of categoryDocs) {
      if (c.image) categoryImages[c.name] = c.image;
    }

    return ok({ categories: ["All", ...sorted], categoryImages });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch categories", 500);
  }
}