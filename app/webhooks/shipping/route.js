import crypto from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { applyTrackingToOrder } from "@/lib/orderTracking";



function safeEqual(a = "", b = "") {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

export async function POST(request) {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  if (!expected) {
    return NextResponse.json({ success: false, error: "Webhook not configured" }, { status: 503 });
  }
  if (!safeEqual(request.headers.get("x-api-key") || "", expected)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: true, ignored: "invalid json" });
  }

  try {
    await connectDB();

    const awb = payload.awb ? String(payload.awb) : "";
    const channelOrderId = payload.channel_order_id || payload.order_id;

    let order = null;
    if (awb) order = await Order.findOne({ "shipment.awbCode": awb });
    if (!order && channelOrderId && mongoose.isValidObjectId(String(channelOrderId))) {
      order = await Order.findById(String(channelOrderId));
    }
    // Always 200 for unknown orders, otherwise Shiprocket keeps retrying / disables the hook
    if (!order || !order.shipment) {
      return NextResponse.json({ success: true, ignored: "order not found" });
    }

    const scans = Array.isArray(payload.scans) ? payload.scans : [];
    const events = scans
      .map((s) => ({
        date: s.date || "",
        status: s["sr-status-label"] || s.status || "",
        activity: s.activity || "",
        location: s.location || "",
      }))
      .reverse(); 

    applyTrackingToOrder(order, {
      found: true,
      status: payload.current_status || payload.shipment_status || "",
      etd: payload.etd || "",
      courierName: payload.courier_name || "",
      trackUrl: "",
      events,
    });
    if (!order.shipment.awbCode && awb) order.shipment.awbCode = awb;

    await order.save();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Shipping webhook error:", e);
    // 500 Shiprocket retry DB failures
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
