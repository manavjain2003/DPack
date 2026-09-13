import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalUsers,
      recentUsers,
      categories,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0, trackInventory: true }),
      Product.countDocuments({
        stock: { $gt: 0 },
        trackInventory: true,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Product.distinct("category"),
    ]);

    return ok({
      stats: {
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        totalUsers,
        recentUsers,
        totalCategories: categories.length,
        categories,
      },
    });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch stats", 500);
  }
}
