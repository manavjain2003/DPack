import crypto from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await request.json();

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return err("Missing payment details");
  }

  await connectDB();

  const order = await Order.findOne({ _id: orderId, userId: authUser._id });
  if (!order) return err("Order not found", 404);
  if (order.paymentStatus === "paid") {
    return ok({ order });
  }
  if (order.razorpayOrderId !== razorpay_order_id) {
    return err("Order/payment mismatch", 400);
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "failed";
    await order.save();
    return err("Payment verification failed", 400);
  }

  for (const item of order.items) {
    await Product.findOneAndUpdate(
      { _id: item.productId, trackInventory: true },
      { $inc: { stock: -item.qty } }
    );
  }
  await User.findByIdAndUpdate(authUser._id, { $set: { cart: [] } });

  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  return ok({ message: "Payment verified, order confirmed", order });
}