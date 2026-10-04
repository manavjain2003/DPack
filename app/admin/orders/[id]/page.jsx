"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, RefreshCw, Truck, MapPin, User, Phone, Mail, Receipt, Package,
  Copy, Check, ExternalLink, AlertTriangle, AlertCircle, Loader2, CalendarClock,
} from "lucide-react";
import { adminAPI } from "@/lib/apiClient";
import { formatINR } from "@/lib/cartBus";
import OrderTimeline from "@/components/OrderTimeline";
import { StatusBadge, PaymentBadge, shortId, formatDate } from "@/components/admin/OrderBadges";

const STATUS_OPTIONS = ["confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

const card = "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm";
const cardTitle = "mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400";
const input =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-rust focus:ring-2 focus:ring-rust/20";

function DetailSkeleton() {
  const bar = (w, h = "h-4") => <div className={`${h} ${w} animate-pulse rounded bg-gray-100`} />;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {bar("w-24", "h-3")}
        {bar("w-64", "h-8")}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={`${card} space-y-4`}>
            {bar("w-24", "h-3")}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">{bar("w-1/2")}{bar("w-24", "h-3")}</div>
                {bar("w-16")}
              </div>
            ))}
          </div>
          <div className={`${card} grid gap-6 sm:grid-cols-2`}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">{bar("w-24", "h-3")}{bar("w-40")}{bar("w-32")}{bar("w-48")}</div>
            ))}
          </div>
        </div>
        <div className={`${card} space-y-4`}>
          {bar("w-28", "h-3")}
          <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-100" />)}</div>
          <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      title="Copy"
    >
      {done ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const addressLines = (a = {}) =>
  [a.line1, a.line2, [a.city, a.state].filter(Boolean).join(", "), [a.pincode, a.country].filter(Boolean).join(" ")]
    .filter(Boolean);

export default function AdminOrderDetailPage({ params }) {
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [suggested, setSuggested] = useState(null);
  const [srConfigured, setSrConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [parcel, setParcel] = useState({ weight: "", length: "", breadth: "", height: "" });
  const [shipping, setShipping] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [notice, setNotice] = useState(null); 

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await adminAPI.getOrder(id);
      setOrder(res.order);
      setSuggested(res.suggestedParcel);
      setSrConfigured(res.shiprocketConfigured);
      setParcel((p) => (p.weight ? p : {
        weight: res.suggestedParcel.weight,
        length: res.suggestedParcel.length,
        breadth: res.suggestedParcel.breadth,
        height: res.suggestedParcel.height,
      }));
    } catch (e) {
      setLoadError(e.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleShip = async () => {
    setShipping(true);
    setNotice(null);
    try {
      const res = await adminAPI.shipOrder(id, parcel);
      setOrder(res.order);
      if (res.warnings?.length) setNotice({ type: "warn", text: res.warnings.join(" ") });
      else setNotice({ type: "success", text: res.message });
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setShipping(false);
    }
  };

  const handleTrack = async () => {
    setTracking(true);
    setNotice(null);
    try {
      const res = await adminAPI.trackOrder(id, { force: true });
      setOrder(res.order);
      if (res.message) setNotice({ type: "warn", text: res.message });
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setTracking(false);
    }
  };

  const handleStatus = async (status) => {
    if (status === order.status) return;
    if (status === "cancelled" && order.shipment?.awbCode &&
        !confirm("This order already has a Shiprocket shipment. Cancelling here does NOT cancel it in Shiprocket — do that from your Shiprocket panel. Continue?")) {
      return;
    }
    setSavingStatus(true);
    try {
      const res = await adminAPI.updateOrder(id, { status });
      setOrder(res.order);
    } catch (e) {
      setNotice({ type: "error", text: e.message });
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading && !order) return <DetailSkeleton />;

  if (loadError) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {loadError}
          <button onClick={load} className="ml-auto font-semibold underline">Retry</button>
        </div>
      </div>
    );
  }

  const sh = order.shipment || {};
  const hasShipment = Boolean(sh.shipmentId);
  const complete = Boolean(sh.awbCode && sh.pickupRequested);
  const canShip =
    order.paymentStatus === "paid" && !["cancelled", "delivered", "returned"].includes(order.status);

  const noticeStyles = {
    success: "border-green-200 bg-green-50 text-green-800",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold text-gray-900">#{shortId(order._id)}</h1>
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
          <span className="text-sm text-gray-400">Placed {formatDate(order.createdAt, true)}</span>
        </div>
      </div>

      {notice && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${noticeStyles[notice.type]}`}>
          {notice.type === "success" ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{notice.text}</span>
        </div>
      )}

      {order.stockIssues?.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" /> Stock shortfall when payment was confirmed
          </p>
          <ul className="mt-1.5 list-inside list-disc text-[13px]">
            {order.stockIssues.map((s, i) => (
              <li key={i}>{s.name}: ordered {s.qtyRequested}, only {s.qtyFulfilled} were in stock</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={card}>
            <h2 className={cardTitle}>Items</h2>
            <div className="divide-y divide-gray-50">
              {order.items?.map((it, i) => (
                <div key={i} className="flex items-center gap-4 py-3 first:pt-0">
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="h-14 w-14 rounded-xl border border-gray-100 object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100"><Package className="h-5 w-5 text-gray-300" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{it.name}</p>
                    <p className="text-xs text-gray-400">{it.category} · {formatINR(it.price)} × {it.qty}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatINR(it.price * it.qty)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatINR(order.total)}</span>
            </div>
          </section>

          <section className={`${card} grid gap-8 sm:grid-cols-2`}>
            <div>
              <h2 className={cardTitle}>Customer</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />{order.customerName || "—"}</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" />{order.customerMobile || "—"}</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" />{order.customerEmail || "—"}</li>
                {order.gstNumber && (
                  <li className="flex items-center gap-2"><Receipt className="h-4 w-4 text-gray-400" />GST: <span className="font-mono">{order.gstNumber}</span></li>
                )}
              </ul>
              {order.notes && (
                <p className="mt-4 rounded-xl bg-gray-50 p-3 text-[13px] text-gray-600">
                  <span className="font-semibold">Customer note:</span> {order.notes}
                </p>
              )}
            </div>
            <div>
              <h2 className={cardTitle}>Ship to</h2>
              <div className="flex gap-2 text-sm text-gray-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="space-y-0.5">
                  {addressLines(order.shippingAddress).map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </div>
              {order.billingAddress?.line1 && order.billingAddress.line1 !== order.shippingAddress?.line1 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Billing</p>
                  <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                    {addressLines(order.billingAddress).map((l, i) => <p key={i}>{l}</p>)}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Payment</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-gray-400">Method</dt><dd className="font-medium capitalize text-gray-800">{order.paymentMethod}</dd></div>
              <div><dt className="text-xs text-gray-400">Razorpay order</dt><dd className="break-all font-mono text-[12px] text-gray-700">{order.razorpayOrderId || "—"}</dd></div>
              <div><dt className="text-xs text-gray-400">Razorpay payment</dt><dd className="break-all font-mono text-[12px] text-gray-700">{order.razorpayPaymentId || "—"}</dd></div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Shipment</h2>
              {sh.awbCode && (
                <button
                  onClick={handleTrack}
                  disabled={tracking}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${tracking ? "animate-spin" : ""}`} />
                  Refresh tracking
                </button>
              )}
            </div>

            {!srConfigured && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">
                Shiprocket isn&apos;t configured. Add <code className="font-mono">SHIPROCKET_EMAIL</code> and{" "}
                <code className="font-mono">SHIPROCKET_PASSWORD</code> to your environment.
              </div>
            )}

            {hasShipment && (
              <dl className="mb-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-400">Courier</dt>
                  <dd className="text-right font-medium text-gray-800">{sh.courierName || "Not assigned"}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-400">AWB</dt>
                  <dd className="flex items-center font-mono text-[13px] text-gray-800">
                    {sh.awbCode || "Not assigned"}
                    {sh.awbCode && <CopyButton text={sh.awbCode} />}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-400">Status</dt>
                  <dd className="text-right font-medium capitalize text-gray-800">{(sh.currentStatus || "—").toLowerCase()}</dd>
                </div>
                {sh.pickupScheduledDate && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-400">Pickup</dt>
                    <dd className="flex items-center gap-1.5 text-right text-gray-800"><CalendarClock className="h-3.5 w-3.5 text-gray-400" />{sh.pickupScheduledDate}</dd>
                  </div>
                )}
                {sh.etd && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-400">Expected delivery</dt>
                    <dd className="text-right text-gray-800">{formatDate(sh.etd)}</dd>
                  </div>
                )}
                {sh.parcel?.weight && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-400">Parcel</dt>
                    <dd className="text-right text-[13px] text-gray-800">
                      {sh.parcel.weight} kg · {sh.parcel.length}×{sh.parcel.breadth}×{sh.parcel.height} cm
                    </dd>
                  </div>
                )}
                {sh.trackingUrl && (
                  <a href={sh.trackingUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-rust hover:underline">
                    Open courier tracking page <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {sh.pickupError && !sh.pickupRequested && (
                  <p className="rounded-lg bg-amber-50 p-2.5 text-[12px] text-amber-800">Last pickup error: {sh.pickupError}</p>
                )}
              </dl>
            )}

            {canShip && !complete && (
              <div className={hasShipment ? "border-t border-gray-100 pt-4" : ""}>
                {!hasShipment && (
                  <>
                    <p className="mb-3 text-[13px] text-gray-500">
                      Confirm the packed parcel, then create the shipment. Shiprocket will auto-assign a courier and we&apos;ll request pickup.
                    </p>
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      {[
                        { k: "weight", label: "Weight (kg)", step: "0.01" },
                        { k: "length", label: "Length (cm)", step: "0.1" },
                        { k: "breadth", label: "Breadth (cm)", step: "0.1" },
                        { k: "height", label: "Height (cm)", step: "0.1" },
                      ].map(({ k, label, step }) => (
                        <div key={k}>
                          <label className="mb-1 block text-[11px] font-medium text-gray-500">{label}</label>
                          <input
                            type="number" min="0" step={step}
                            value={parcel[k]}
                            onChange={(e) => setParcel((p) => ({ ...p, [k]: e.target.value }))}
                            className={input}
                          />
                        </div>
                      ))}
                    </div>
                    {suggested && (
                      <p className="mb-4 text-[11px] text-gray-400">
                        Pre-filled from product shipping details (defaults used where missing).
                      </p>
                    )}
                  </>
                )}
                <button
                  onClick={handleShip}
                  disabled={shipping || !srConfigured}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rust px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {shipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                  {shipping ? "Contacting Shiprocket…" : hasShipment ? "Retry remaining steps" : "Create shipment"}
                </button>
              </div>
            )}

            {!canShip && !hasShipment && (
              <p className="text-sm text-gray-400">
                {order.paymentStatus !== "paid" ? "Shipping is available once the order is paid." : `This order is ${order.status}.`}
              </p>
            )}

            {sh.awbCode && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Tracking</h3>
                  {sh.lastTrackedAt && (
                    <span className="text-[11px] text-gray-400">Updated {formatDate(sh.lastTrackedAt, true)}</span>
                  )}
                </div>
                <OrderTimeline events={sh.events} />
                {!sh.events?.length && (
                  <button onClick={handleTrack} className="mt-3 text-[13px] font-medium text-rust hover:underline">
                    Fetch tracking now
                  </button>
                )}
              </div>
            )}
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Order status</h2>
            <div className="flex items-center gap-3">
              <select
                value={order.status}
                disabled={savingStatus}
                onChange={(e) => handleStatus(e.target.value)}
                className={`${input} capitalize`}
              >
                {order.status === "pending" && <option value="pending">pending</option>}
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {savingStatus && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Status updates automatically from courier tracking. Use this only to override.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
