import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import { computeParcel, isShiprocketConfigured } from "@/lib/shiprocket";

const STATUSES = Order.schema.path("status").enumValues;

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    if (!mongoose.isValidObjectId(params.id)) return err("Invalid order id");
    await connectDB();

    const order = await Order.findById(params.id).select("-razorpaySignature").lean();
    if (!order) return err("Order not found", 404);

    const products = await Product.find({
      _id: { $in: (order.items || []).map((i) => i.productId).filter(Boolean) },
    }).lean();
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    return ok({
      order,
      suggestedParcel: computeParcel(order.items, productMap),
      shiprocketConfigured: isShiprocketConfigured(),
    });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch order", 500);
  }
}

/** Manual updates: status override and internal notes. */
export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    if (!mongoose.isValidObjectId(params.id)) return err("Invalid order id");
    await connectDB();

    const body = await request.json();
    const order = await Order.findById(params.id);
    if (!order) return err("Order not found", 404);

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return err("Invalid status");
      order.status = body.status;
      if (body.status === "delivered" && order.shipment) order.shipment.deliveredAt = new Date();
    }
    if (body.notes !== undefined) order.notes = String(body.notes).slice(0, 1000);

    await order.save();
    return ok({ order });
  } catch (e) {
    console.error(e);
    return err("Failed to update order", 500);
  }
}
