import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

// GET wishlist
export async function GET(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  await connectDB();
  const user = await User.findById(authUser._id).populate("wishlist.productId");
  const items = (user.wishlist || [])
    .filter((w) => w.productId)
    .map((w) => ({ ...w.productId.toJSON(), addedAt: w.addedAt }));

  return ok({ wishlist: items });
}

// POST add to wishlist
export async function POST(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { productId } = await request.json();
  if (!productId) return err("productId required");

  await connectDB();
  const product = await Product.findById(productId);
  if (!product) return err("Product not found", 404);

  const user = await User.findById(authUser._id);
  const exists = user.wishlist.some(
    (w) => w.productId.toString() === productId
  );
  if (!exists) {
    user.wishlist.unshift({ productId, addedAt: new Date() });
    await user.save();
  }
  return ok({ message: "Added to wishlist" });
}

// DELETE remove from wishlist
export async function DELETE(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  const { productId } = await request.json();
  if (!productId) return err("productId required");

  await connectDB();
  await User.findByIdAndUpdate(authUser._id, {
    $pull: { wishlist: { productId } },
  });
  return ok({ message: "Removed from wishlist" });
}
