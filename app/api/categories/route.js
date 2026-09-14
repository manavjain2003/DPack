import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { ok, err } from "@/lib/apiHelpers";

export async function GET() {
  try {
    await connectDB();
    const cats = await Product.distinct("category", { isActive: true });
    const sorted = cats.sort();

    const categoryDocs = await Category.find({ name: { $in: sorted } }).lean();
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