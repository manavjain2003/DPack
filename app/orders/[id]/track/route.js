import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAuth, ok, err } from "@/lib/apiHelpers";
import { refreshOrderTracking } from "@/lib/orderTracking";

/** A customer can only track their own orders. */
export async function GET(request, { params }) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    if (!mongoose.isValidObjectId(params.id)) return err("Invalid order id");
    await connectDB();

    const order = await Order.findOne({ _id: params.id, userId: user._id });
    if (!order) return err("Order not found", 404);

    if (!order.shipment?.awbCode) {
      return ok({ tracking: null, status: order.status });
    }

    let message = "";
    try {
      const r = await refreshOrderTracking(order);
      message = r.message || "";
    } catch (e) {
      console.error("Customer track refresh failed:", e.message);
    }

    const sh = order.shipment;
    return ok({
      status: order.status,
      message,
      tracking: {
        courierName: sh.courierName || "",
        awbCode: sh.awbCode,
        currentStatus: sh.currentStatus || "",
        etd: sh.etd || "",
        trackingUrl: sh.trackingUrl || "",
        events: sh.events || [],
        lastTrackedAt: sh.lastTrackedAt || null,
      },
    });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch tracking", 500);
  }
}
