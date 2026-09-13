import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
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


export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { items } = await request.json();
  if (!Array.isArray(items)) return err("items array required");

  await connectDB();
  const user = await User.findById(authUser._id);

  for (const item of items) {
    if (!item?.productId) continue;
    const qty = Math.max(1, Number(item.qty) || 1);
    const existing = user.cart.find(
      (c) => c.productId.toString() === item.productId
    );
    if (existing) {
      existing.qty = Math.max(existing.qty, qty);
    } else {
      user.cart.unshift({ productId: item.productId, qty, addedAt: new Date() });
    }
  }

  await user.save();

  const populated = await User.findById(authUser._id).populate("cart.productId");
  return ok({ cart: serializeCart(populated) });
}