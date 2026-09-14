import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { requireAuth, ok, err } from "@/lib/apiHelpers";
import { getRazorpay } from "@/lib/razorpay";

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

  const total = subtotal; 

  const order = await Order.create({
    userId: authUser._id,
    items: orderItems,
    subtotal,
    total,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "razorpay",
    customerName: customerName.trim(),
    customerEmail: customerEmail?.trim() || "",
    customerMobile: customerMobile || authUser.mobile,
    shippingAddress: cleanAddress(shippingAddress),
    billingAddress: resolvedBilling,
    gstNumber: gstNumber?.trim() || "",
    notes: notes?.trim() || "",
  });

  let razorpayOrder;
  try {
    razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100), 
      currency: "INR",
      receipt: String(order._id),
      notes: { orderId: String(order._id), userId: String(authUser._id) },
    });
  } catch (e) {
    console.error("Razorpay order creation failed:", e);
    order.paymentStatus = "failed";
    await order.save();
    return err("Could not start payment. Please try again.", 502);
  }

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return ok(
    {
      message: "Order created, awaiting payment",
      order,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    },
    201
  );
}

export async function GET(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  await connectDB();
  const orders = await Order.find({ userId: authUser._id }).sort({ createdAt: -1 });
  return ok({ orders });
}