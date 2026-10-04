import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * "Orders received" = orders the customer has actually paid for.
 * Views:
 *   paid (default) – every paid order
 *   confirmed | processing | shipped | delivered | returned | cancelled – paid orders in that state
 *   unpaid – payment pending / failed (abandoned checkouts)
 *   all
 */
function viewFilter(view) {
  switch (view) {
    case "all":
      return {};
    case "unpaid":
      return { paymentStatus: { $in: ["pending", "failed"] } };
    case "confirmed":
    case "processing":
    case "shipped":
    case "delivered":
    case "returned":
    case "cancelled":
      return { paymentStatus: "paid", status: view };
    case "paid":
    default:
      return { paymentStatus: "paid" };
  }
}

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const view = searchParams.get("view") || "paid";
    const q = (searchParams.get("q") || "").trim();

    const query = viewFilter(view);

    if (q) {
      const rx = escapeRegex(q);
      query.$or = [
        { customerName: { $regex: rx, $options: "i" } },
        { customerMobile: { $regex: rx, $options: "i" } },
        { customerEmail: { $regex: rx, $options: "i" } },
        { "shipment.awbCode": { $regex: rx, $options: "i" } },
        // The UI shows the last 8 chars of the id as the order number
        { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: rx, options: "i" } } },
      ];
    }

    const [total, orders, grouped] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .select("-razorpaySignature -billingAddress -stockIssues")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.aggregate([{ $group: { _id: { p: "$paymentStatus", s: "$status" }, n: { $sum: 1 } } }]),
    ]);

    const counts = {
      all: 0, paid: 0, unpaid: 0,
      confirmed: 0, processing: 0, shipped: 0, delivered: 0, returned: 0, cancelled: 0,
    };
    for (const g of grouped) {
      counts.all += g.n;
      if (g._id.p === "paid") {
        counts.paid += g.n;
        if (g._id.s in counts) counts[g._id.s] += g.n;
      } else {
        counts.unpaid += g.n;
      }
    }

    return ok({ orders, total, page, limit, counts });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch orders", 500);
  }
}
