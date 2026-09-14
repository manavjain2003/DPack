import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { orderId } = await request.json();
  if (!orderId) return err("orderId required");

  await connectDB();
  const order = await Order.findOne({ _id: orderId, userId: authUser._id });
  if (!order) return err("Order not found", 404);

  if (order.paymentStatus !== "paid") {
    order.paymentStatus = "failed";
    order.status = "cancelled";
    await order.save();
  }

  return ok({ order });
}