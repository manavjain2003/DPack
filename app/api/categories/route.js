import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { ok, err } from "@/lib/apiHelpers";

export async function GET() {
  try {
    await connectDB();
    const cats = await Product.distinct("category", { isActive: true });
    return ok({ categories: ["All", ...cats.sort()] });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch categories", 500);
  }
}