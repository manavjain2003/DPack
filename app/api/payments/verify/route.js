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

  if (
    expectedSignature.length !== razorpay_signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature))
  ) {
    order.paymentStatus = "failed";
    await order.save();
    return err("Payment verification failed", 400);
  }

  const claimed = await Order.findOneAndUpdate(
    { _id: order._id, userId: authUser._id, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    },
    { new: true }
  );

  if (!claimed) {
    const existing = await Order.findById(order._id);
    return ok({ order: existing });
  }

  const stockIssues = [];
  for (const item of claimed.items) {
    const decremented = await Product.findOneAndUpdate(
      { _id: item.productId, trackInventory: true, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } }
    );
    if (!decremented) {
      const product = await Product.findById(item.productId);
      let fulfilled = 0;
      const available = product?.trackInventory ? Math.max(0, product.stock) : item.qty;
      if (available > 0) {
        const partial = await Product.findOneAndUpdate(
          { _id: item.productId, trackInventory: true, stock: { $gte: available } },
          { $inc: { stock: -available } }
        );
        fulfilled = partial ? available : 0;
      }
      stockIssues.push({
        productId: item.productId,
        name: item.name,
        qtyRequested: item.qty,
        qtyFulfilled: fulfilled,
      });
    }
  }
 
  await User.findByIdAndUpdate(authUser._id, { $set: { cart: [] } });

  let finalOrder = claimed;
  if (stockIssues.length > 0) {
    finalOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: { stockIssues } },
      { new: true }
    );
  }

  return ok({ message: "Payment verified, order confirmed", order: finalOrder });
}