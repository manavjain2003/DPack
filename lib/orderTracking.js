import {
  trackAwb,
  parseTracking,
  mapShiprocketStatus,
  publicTrackingUrl,
} from "@/lib/shiprocket";

const MIN_REFRESH_MS = 2 * 60 * 1000;

const FINAL_STATUSES = ["delivered", "cancelled", "returned"];


export function applyTrackingToOrder(order, tracking) {
  if (!tracking?.found) return;

  const sh = order.shipment;
  sh.currentStatus = tracking.status || sh.currentStatus;
  if (tracking.etd) sh.etd = tracking.etd;
  if (tracking.courierName && !sh.courierName) sh.courierName = tracking.courierName;
  if (tracking.events?.length) sh.events = tracking.events;
  sh.trackingUrl = tracking.trackUrl || sh.trackingUrl || publicTrackingUrl(sh.awbCode);
  sh.lastTrackedAt = new Date();

  const mapped = mapShiprocketStatus(tracking.status);
  if (mapped && order.status !== "cancelled" && !FINAL_STATUSES.includes(order.status)) {
    if (mapped !== order.status) {
      order.status = mapped;
      if (mapped === "shipped" && !sh.shippedAt) sh.shippedAt = new Date();
      if (mapped === "delivered") sh.deliveredAt = new Date();
    }
  }
}

/**
 * Refresh tracking for an order from Shiprocket and save.
 * @returns {{ order, refreshed: boolean, message?: string }}
 */
export async function refreshOrderTracking(order, { force = false } = {}) {
  const sh = order.shipment;
  if (!sh?.awbCode) {
    return { order, refreshed: false, message: "This order has no AWB yet" };
  }

  const last = sh.lastTrackedAt ? new Date(sh.lastTrackedAt).getTime() : 0;
  const isFinal = FINAL_STATUSES.includes(order.status);
  if (!force && Date.now() - last < MIN_REFRESH_MS) {
    return { order, refreshed: false };
  }
  if (!force && isFinal && sh.events?.length) {
    return { order, refreshed: false };
  }

  const raw = await trackAwb(sh.awbCode);
  const tracking = parseTracking(raw);

  if (!tracking.found) {
    sh.lastTrackedAt = new Date();
    await order.save();
    return { order, refreshed: true, message: tracking.message };
  }

  applyTrackingToOrder(order, tracking);
  await order.save();
  return { order, refreshed: true };
}
