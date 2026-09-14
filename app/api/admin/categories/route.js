import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { requireAdmin, ok, err, parseFormData } from "@/lib/apiHelpers";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

function buildSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}


export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await connectDB();
  const names = (await Product.distinct("category", { isActive: true })).sort();
  const docs = await Category.find({ name: { $in: names } }).lean();
  const byName = Object.fromEntries(docs.map((d) => [d.name, d]));

  const categories = names.map((name) => ({
    name,
    slug: byName[name]?.slug || buildSlug(name),
    image: byName[name]?.image || null,
  }));

  return ok({ categories });
}


export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const { fields, files } = await parseFormData(request);
    const name = fields.name?.trim();
    if (!name) return err("Category name is required");
    if (!files.image) return err("An image file is required");

    const existing = await Category.findOne({ name });
    if (existing?.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId);
    }

    const { url, public_id } = await uploadToCloudinary(
      files.image.buffer,
      "dpack/categories"
    );

    const category = await Category.findOneAndUpdate(
      { name },
      { name, slug: buildSlug(name), image: url, imagePublicId: public_id },
      { upsert: true, new: true }
    );

    return ok({ category });
  } catch (e) {
    console.error(e);
    return err("Failed to save category image", 500);
  }
}

// DELETE remove a category's custom image, reverting it to the default
// placeholder. Body: { name }
export async function DELETE(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { name } = await request.json();
  if (!name) return err("Category name is required");

  await connectDB();
  const existing = await Category.findOne({ name });
  if (existing?.imagePublicId) {
    await deleteFromCloudinary(existing.imagePublicId);
  }
  await Category.deleteOne({ name });

  return ok({ message: "Category image removed" });
}