import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import { refreshOrderTracking } from "@/lib/orderTracking";
import { ShiprocketError } from "@/lib/shiprocket";

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    if (!mongoose.isValidObjectId(params.id)) return err("Invalid order id");
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return err("Order not found", 404);

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "1";

    const result = await refreshOrderTracking(order, { force });
    return ok({
      order: result.order,
      refreshed: result.refreshed,
      message: result.message || "",
    });
  } catch (e) {
    console.error("Track order failed:", e);
    if (e instanceof ShiprocketError) return err(e.message, e.status === 503 ? 503 : 502);
    return err("Failed to fetch tracking", 500);
  }
}
