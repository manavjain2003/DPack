

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;
let tokenCache = { token: null, expiresAt: 0 };

export class ShiprocketError extends Error {
  constructor(message, status = 502, data = null) {
    super(message);
    this.name = "ShiprocketError";
    this.status = status;
    this.data = data;
  }
}

export function isShiprocketConfigured() {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

function extractMessage(data, fallback) {
  if (!data) return fallback;
  if (data.errors && typeof data.errors === "object") {
    const flat = Object.values(data.errors).flat().filter(Boolean);
    if (flat.length) return flat.join(", ");
  }
  return data.message || fallback;
}

async function login() {
  if (!isShiprocketConfigured()) {
    throw new ShiprocketError(
      "Shiprocket is not configured — set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD",
      503
    );
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new ShiprocketError(
      extractMessage(data, "Shiprocket login failed — check API user credentials"),
      res.status === 403 || res.status === 401 ? 502 : res.status || 502,
      data
    );
  }
  tokenCache = { token: data.token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return data.token;
}

async function getToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  return login();
}

async function srFetch(path, { method = "GET", body, retry = true } = {}) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401 && retry) {
    tokenCache = { token: null, expiresAt: 0 };
    return srFetch(path, { method, body, retry: false });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ShiprocketError(
      extractMessage(data, `Shiprocket request failed (${res.status})`),
      res.status === 404 ? 404 : 502,
      data
    );
  }
  return data;
}


const envNum = (key, fallback) => {
  const n = parseFloat(process.env[key]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const round2 = (n) => Math.round(n * 100) / 100;

export function cleanPhone(raw = "") {
  return String(raw).replace(/\D/g, "").slice(-10);
}


export function computeParcel(items = [], productMap = new Map()) {
  const defW = envNum("SHIPROCKET_DEFAULT_WEIGHT_KG", 0.5);
  const defL = envNum("SHIPROCKET_DEFAULT_LENGTH_CM", 20);
  const defB = envNum("SHIPROCKET_DEFAULT_BREADTH_CM", 15);
  const defH = envNum("SHIPROCKET_DEFAULT_HEIGHT_CM", 10);

  let weight = 0;
  let length = 0;
  let breadth = 0;
  let height = 0;

  for (const item of items) {
    const qty = Math.max(1, Number(item.qty) || 1);
    const p = productMap.get(String(item.productId));
    weight += (p?.weight || defW) * qty;
    length = Math.max(length, p?.length || defL);
    breadth = Math.max(breadth, p?.breadth || defB);
    height += (p?.height || defH) * qty;
  }

  return {
    weight: Math.max(0.1, round2(weight)),
    length: round2(length || defL),
    breadth: round2(breadth || defB),
    height: round2(height || defH),
  };
}

function srDate(d) {
  return new Date(d).toLocaleString("sv-SE", { timeZone: "Asia/Kolkata" }).slice(0, 16);
}

export function buildAdhocOrderPayload(order, productMap, parcel) {
  const ship = order.shippingAddress || {};
  const bill = order.billingAddress?.line1 ? order.billingAddress : ship;

  const [first, ...rest] = String(order.customerName || "Customer").trim().split(/\s+/);
  const last = rest.join(" ");
  const phone = cleanPhone(order.customerMobile);
  const email =
    order.customerEmail ||
    process.env.SHIPROCKET_FALLBACK_EMAIL ||
    "orders@dpacksolutions.com";

  const sameAddress =
    bill.line1 === ship.line1 && bill.pincode === ship.pincode && bill.city === ship.city;

  const commentParts = [];
  if (order.notes) commentParts.push(order.notes);
  if (order.gstNumber) commentParts.push(`GST: ${order.gstNumber}`);

  return {
    order_id: String(order._id),
    order_date: srDate(order.createdAt || Date.now()),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
    comment: commentParts.join(" | "),

    billing_customer_name: first,
    billing_last_name: last,
    billing_address: bill.line1 || ship.line1,
    billing_address_2: bill.line2 || "",
    billing_city: bill.city || ship.city,
    billing_pincode: bill.pincode || ship.pincode,
    billing_state: bill.state || ship.state,
    billing_country: bill.country || "India",
    billing_email: email,
    billing_phone: phone,

    shipping_is_billing: sameAddress,
    shipping_customer_name: first,
    shipping_last_name: last,
    shipping_address: ship.line1,
    shipping_address_2: ship.line2 || "",
    shipping_city: ship.city,
    shipping_pincode: ship.pincode,
    shipping_country: ship.country || "India",
    shipping_state: ship.state,
    shipping_email: email,
    shipping_phone: phone,

    order_items: (order.items || []).map((it) => {
      const p = productMap.get(String(it.productId));
      return {
        name: it.name,
        sku: p?.slug || String(it.productId),
        units: Math.max(1, Number(it.qty) || 1),
        selling_price: Number(it.price) || 0,
        discount: "",
        tax: "",
        hsn: "",
      };
    }),

    payment_method: "Prepaid",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: Number(order.subtotal ?? order.total) || 0,

    length: parcel.length,
    breadth: parcel.breadth,
    height: parcel.height,
    weight: parcel.weight,
  };
}

export async function createAdhocOrder(payload) {
  return srFetch("/orders/create/adhoc", { method: "POST", body: payload });
}


export async function assignAwb(shipmentId, courierId) {
  const body = { shipment_id: String(shipmentId) };
  if (courierId) body.courier_id = String(courierId);
  const res = await srFetch("/courier/assign/awb", { method: "POST", body });

  const data = res?.response?.data;
  if (res?.awb_assign_status !== 1 || !data?.awb_code) {
    throw new ShiprocketError(
      data?.awb_assign_error || res?.message || "Shiprocket could not assign an AWB",
      502,
      res
    );
  }
  return {
    awbCode: String(data.awb_code),
    courierName: data.courier_name || "",
    courierCompanyId: data.courier_company_id,
  };
}

export async function requestPickup(shipmentId) {
  const res = await srFetch("/courier/generate/pickup", {
    method: "POST",
    body: { shipment_id: [Number(shipmentId)] },
  });
  if (res?.pickup_status !== 1) {
    const r = res?.response;
    throw new ShiprocketError(
      (typeof r?.data === "string" && r.data) || res?.message || "Pickup request failed",
      502,
      res
    );
  }
  return {
    pickupScheduledDate: res.response?.pickup_scheduled_date || "",
  };
}

export async function trackAwb(awb) {
  return srFetch(`/courier/track/awb/${encodeURIComponent(awb)}`);
}


export function parseTracking(res) {
  const td = res?.tracking_data;
  if (!td || td.track_status === 0) {
    return { found: false, message: td?.error || "Tracking not available yet" };
  }

  const st = Array.isArray(td.shipment_track) ? td.shipment_track[0] : null;
  const activities = Array.isArray(td.shipment_track_activities)
    ? td.shipment_track_activities
    : [];

  const events = activities.map((a) => ({
    date: a.date || "",
    status: a["sr-status-label"] || a.status || "",
    activity: a.activity || "",
    location: a.location || "",
  }));

  return {
    found: true,
    status: st?.current_status || events[0]?.status || "",
    etd: td.etd || st?.edd || "",
    trackUrl: td.track_url || "",
    courierName: st?.courier_name || "",
    events, 
  };
}


export function mapShiprocketStatus(label = "") {
  const u = String(label).toUpperCase();
  if (!u) return null;
  if (u.includes("RTO")) return "returned";
  if (u.includes("UNDELIVERED")) return "shipped";
  if (u.includes("DELIVERED")) return "delivered";
  if (
    u.includes("OUT FOR DELIVERY") ||
    u.includes("IN TRANSIT") ||
    u.includes("PICKED UP") ||
    u.includes("SHIPPED") ||
    u.includes("REACHED")
  ) {
    return "shipped";
  }
  if (u.includes("PICKUP") || u === "NEW" || u.includes("READY")) return "processing";
  return null;
}

export function publicTrackingUrl(awb) {
  return awb ? `https://shiprocket.co/tracking/${awb}` : "";
}
