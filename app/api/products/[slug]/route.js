import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { ok, err } from "@/lib/apiHelpers";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findOne({
      slug: params.slug,
      isActive: true,
    }).lean();

    if (!product) return err("Product not found", 404);

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    return ok({ product, related });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch product", 500);
  }
}
