import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import {
  isShiprocketConfigured,
  computeParcel,
  buildAdhocOrderPayload,
  createAdhocOrder,
  assignAwb,
  requestPickup,
  publicTrackingUrl,
  ShiprocketError,
} from "@/lib/shiprocket";

const positive = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Creates the shipment on Shiprocket in three steps:
 *   1. create order  2. assign AWB / courier  3. request pickup
 * The route is idempotent: every step that already succeeded is skipped, so if
 * step 2 or 3 fails the admin can simply press the button again to resume.
 */
export async function POST(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  if (!isShiprocketConfigured()) {
    return err("Shiprocket is not configured on the server (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD)", 503);
  }
  if (!mongoose.isValidObjectId(params.id)) return err("Invalid order id");

  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return err("Order not found", 404);
    if (order.paymentStatus !== "paid") return err("Only paid orders can be shipped");
    if (["cancelled", "delivered", "returned"].includes(order.status)) {
      return err(`Cannot ship an order that is ${order.status}`);
    }

    const body = await request.json().catch(() => ({}));
    const sh = order.shipment || {};
    const warnings = [];

    /* ── Step 1: create order on Shiprocket ── */
    if (!sh.shipmentId) {
      const sa = order.shippingAddress || {};
      if (!/^\d{6}$/.test(String(sa.pincode || "").trim())) {
        return err("Shipping pincode must be a valid 6-digit PIN code");
      }

      const products = await Product.find({
        _id: { $in: order.items.map((i) => i.productId).filter(Boolean) },
      }).lean();
      const productMap = new Map(products.map((p) => [String(p._id), p]));

      const auto = computeParcel(order.items, productMap);
      const parcel = {
        weight: positive(body.weight) ?? auto.weight,
        length: positive(body.length) ?? auto.length,
        breadth: positive(body.breadth) ?? auto.breadth,
        height: positive(body.height) ?? auto.height,
      };

      const created = await createAdhocOrder(buildAdhocOrderPayload(order, productMap, parcel));
      if (!created?.shipment_id) {
        return err(created?.message || "Shiprocket did not return a shipment id", 502);
      }

      order.set("shipment.provider", "shiprocket");
      order.set("shipment.srOrderId", created.order_id);
      order.set("shipment.shipmentId", created.shipment_id);
      order.set("shipment.parcel", parcel);
      if (created.awb_code) {
        order.set("shipment.awbCode", String(created.awb_code));
        order.set("shipment.courierName", created.courier_name || "");
        order.set("shipment.courierCompanyId", created.courier_company_id);
        order.set("shipment.trackingUrl", publicTrackingUrl(created.awb_code));
      }
      if (order.status === "confirmed") order.status = "processing";
      await order.save();
    }

    /* ── Step 2: assign AWB / courier ── */
    if (!order.shipment.awbCode) {
      try {
        const awb = await assignAwb(order.shipment.shipmentId, body.courierId);
        order.set("shipment.awbCode", awb.awbCode);
        order.set("shipment.courierName", awb.courierName);
        order.set("shipment.courierCompanyId", awb.courierCompanyId);
        order.set("shipment.trackingUrl", publicTrackingUrl(awb.awbCode));
        order.set("shipment.currentStatus", "AWB ASSIGNED");
        await order.save();
      } catch (e) {
        warnings.push(`AWB not assigned: ${e.message}. Press the button again to retry.`);
      }
    }

    /* ── Step 3: schedule pickup ── */
    if (order.shipment.awbCode && !order.shipment.pickupRequested) {
      try {
        const pickup = await requestPickup(order.shipment.shipmentId);
        order.set("shipment.pickupRequested", true);
        order.set("shipment.pickupScheduledDate", pickup.pickupScheduledDate);
        order.set("shipment.pickupError", "");
        order.set("shipment.currentStatus", "PICKUP SCHEDULED");
        await order.save();
      } catch (e) {
        order.set("shipment.pickupError", e.message);
        await order.save();
        warnings.push(`Pickup not scheduled: ${e.message}. Press the button again to retry.`);
      }
    }

    const done = order.shipment.awbCode && order.shipment.pickupRequested;
    return ok({
      order,
      warnings,
      message: done
        ? "Shipment created and pickup scheduled"
        : "Shipment created on Shiprocket, but some steps need a retry",
    });
  } catch (e) {
    console.error("Ship order failed:", e);
    if (e instanceof ShiprocketError) return err(e.message, e.status === 503 ? 503 : 502);
    return err("Failed to create shipment", 500);
  }
}
