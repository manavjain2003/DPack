import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const total = await User.countDocuments();
    const users = await User.find()
      .select("-wishlist")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ok({ users, total, page, limit });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch users", 500);
  }
}
