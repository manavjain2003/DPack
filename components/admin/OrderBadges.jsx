export const shortId = (id) => String(id || "").slice(-8).toUpperCase();

const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
  returned: "bg-orange-50 text-orange-700",
};

const STATUS_LABELS = {
  confirmed: "To ship",
  processing: "Pickup pending",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STATUS_STYLES[status] || STATUS_STYLES.pending
      }`}
    >
      {STATUS_LABELS[status] || status || "—"}
    </span>
  );
}

const PAY_STYLES = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
};

export function PaymentBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        PAY_STYLES[status] || PAY_STYLES.pending
      }`}
    >
      {status || "—"}
    </span>
  );
}

export const formatDate = (d, withTime = false) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
      })
    : "—";
