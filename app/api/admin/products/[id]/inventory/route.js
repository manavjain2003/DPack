import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const product = await Product.findById(params.id)
    .select("name stock lowStockThreshold trackInventory stockStatus")
    .lean();
  if (!product) return err("Product not found", 404);
  return ok({ inventory: product });
}

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { action, quantity, lowStockThreshold, trackInventory } =
      await request.json();

    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return err("Product not found", 404);

    if (trackInventory !== undefined) product.trackInventory = trackInventory;
    if (lowStockThreshold !== undefined)
      product.lowStockThreshold = parseInt(lowStockThreshold);

    if (action === "set") {
      product.stock = parseInt(quantity);
    } else if (action === "add") {
      product.stock += parseInt(quantity);
    } else if (action === "subtract") {
      product.stock = Math.max(0, product.stock - parseInt(quantity));
    }

    await product.save();
    return ok({
      stock: product.stock,
      stockStatus: product.stockStatus,
      lowStockThreshold: product.lowStockThreshold,
    });
  } catch (e) {
    console.error(e);
    return err("Failed to update inventory", 500);
  }
}
