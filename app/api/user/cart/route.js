import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

function serializeCart(user) {
  return (user.cart || [])
    .filter((c) => c.productId)
    .map((c) => ({
      ...c.productId.toJSON(),
      qty: c.qty,
      addedAt: c.addedAt,
    }));
}

export async function GET(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  await connectDB();
  const user = await User.findById(authUser._id).populate("cart.productId");
  return ok({ cart: serializeCart(user) });
}

export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { productId, qty } = await request.json();
  if (!productId) return err("productId required");
  const addQty = Math.max(1, Number(qty) || 1);

  await connectDB();
  const product = await Product.findById(productId);
  if (!product) return err("Product not found", 404);

  const user = await User.findById(authUser._id);
  const existing = user.cart.find((c) => c.productId.toString() === productId);
  if (existing) {
    existing.qty += addQty;
  } else {
    user.cart.unshift({ productId, qty: addQty, addedAt: new Date() });
  }
  await user.save();

  const populated = await User.findById(authUser._id).populate("cart.productId");
  return ok({ message: "Added to cart", cart: serializeCart(populated) });
}

export async function PATCH(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { productId, qty } = await request.json();
  if (!productId) return err("productId required");
  const nextQty = Number(qty);

  await connectDB();
  const user = await User.findById(authUser._id);

  if (!nextQty || nextQty <= 0) {
    user.cart = user.cart.filter((c) => c.productId.toString() !== productId);
  } else {
    const existing = user.cart.find((c) => c.productId.toString() === productId);
    if (existing) existing.qty = nextQty;
    else user.cart.unshift({ productId, qty: nextQty, addedAt: new Date() });
  }
  await user.save();

  const populated = await User.findById(authUser._id).populate("cart.productId");
  return ok({ message: "Cart updated", cart: serializeCart(populated) });
}

export async function DELETE(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { productId } = await request.json();
  if (!productId) return err("productId required");

  await connectDB();
  await User.findByIdAndUpdate(authUser._id, {
    $pull: { cart: { productId } },
  });

  const populated = await User.findById(authUser._id).populate("cart.productId");
  return ok({ message: "Removed from cart", cart: serializeCart(populated) });
}