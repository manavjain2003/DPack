import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { ok, err } from "@/lib/apiHelpers";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query = { isActive: true };
    if (category && category !== "All") query.category = category;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ok({ products, total, page, limit });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch products", 500);
  }
}
