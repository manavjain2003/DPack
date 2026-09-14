import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

function cleanAddress(addr = {}) {
  return {
    line1: addr.line1 || "",
    line2: addr.line2 || "",
    city: addr.city || "",
    state: addr.state || "",
    pincode: addr.pincode || "",
    country: addr.country || "India",
  };
}

export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const {
    items, 
    customerName,
    customerEmail,
    customerMobile,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    gstNumber,
    notes,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return err("Cart is empty");
  }
  if (!customerName?.trim()) return err("Name is required");
  if (
    !shippingAddress?.line1?.trim() ||
    !shippingAddress?.city?.trim() ||
    !shippingAddress?.state?.trim() ||
    !shippingAddress?.pincode?.trim()
  ) {
    return err("A complete shipping address is required");
  }

  await connectDB();


  const orderItems = [];
  let subtotal = 0;

  for (const raw of items) {
    const qty = Math.max(1, Number(raw.qty) || 1);
    const product = await Product.findById(raw.productId);
    if (!product || !product.isActive) {
      return err(`"${raw.name || raw.productId}" is no longer available`);
    }
    if (product.trackInventory && product.stock < qty) {
      return err(`Not enough stock for "${product.name}" (only ${product.stock} left)`);
    }
    orderItems.push({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty,
      category: product.category,
    });
    subtotal += product.price * qty;
  }

  const resolvedBilling = sameAsShipping
    ? cleanAddress(shippingAddress)
    : cleanAddress(billingAddress || shippingAddress);

  const order = await Order.create({
    userId: authUser._id,
    items: orderItems,
    subtotal,
    total: subtotal, 
    status: "pending",
    customerName: customerName.trim(),
    customerEmail: customerEmail?.trim() || "",
    customerMobile: customerMobile || authUser.mobile,
    shippingAddress: cleanAddress(shippingAddress),
    billingAddress: resolvedBilling,
    gstNumber: gstNumber?.trim() || "",
    notes: notes?.trim() || "",
  });

  for (const item of orderItems) {
    await Product.findOneAndUpdate(
      { _id: item.productId, trackInventory: true },
      { $inc: { stock: -item.qty } }
    );
  }

  await User.findByIdAndUpdate(authUser._id, { $set: { cart: [] } });

  return ok({ message: "Order placed", order }, 201);
}

export async function GET(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  await connectDB();
  const orders = await Order.find({ userId: authUser._id }).sort({ createdAt: -1 });
  return ok({ orders });
}