import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalUsers,
      recentUsers,
      categories,
      orderGroups,
      unpaidOrders,
      revenueAgg,
      recentOrderCount,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0, trackInventory: true }),
      Product.countDocuments({
        stock: { $gt: 0 },
        trackInventory: true,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Product.distinct("category"),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$total" } } },
      ]),
      Order.countDocuments({ paymentStatus: { $in: ["pending", "failed"] } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid", status: { $nin: ["cancelled"] } } },
        { $group: { _id: null, revenue: { $sum: "$total" } } },
      ]),
      Order.countDocuments({
        paymentStatus: "paid",
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Order.find({ paymentStatus: "paid" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("customerName customerMobile total status items createdAt shipment.awbCode shipment.courierName")
        .lean(),
    ]);

    const byStatus = Object.fromEntries(orderGroups.map((g) => [g._id, g.count]));
    const totalOrders = orderGroups.reduce((n, g) => n + g.count, 0);
    const orders = {
      total: totalOrders,
      toShip: (byStatus.confirmed || 0) + (byStatus.processing || 0),
      confirmed: byStatus.confirmed || 0,
      processing: byStatus.processing || 0,
      shipped: byStatus.shipped || 0,
      delivered: byStatus.delivered || 0,
      returned: byStatus.returned || 0,
      cancelled: byStatus.cancelled || 0,
      unpaid: unpaidOrders,
      last30d: recentOrderCount,
      revenue: revenueAgg[0]?.revenue || 0,
      recent: recentOrders.map((o) => ({
        _id: o._id,
        customerName: o.customerName,
        customerMobile: o.customerMobile,
        total: o.total,
        status: o.status,
        itemCount: o.items?.length || 0,
        createdAt: o.createdAt,
        awbCode: o.shipment?.awbCode || "",
        courierName: o.shipment?.courierName || "",
      })),
    };

    return ok({
      stats: {
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        totalUsers,
        recentUsers,
        totalCategories: categories.length,
        categories,
        orders,
      },
    });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch stats", 500);
  }
}
