import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { requireAdmin, ok, err, parseFormData } from "@/lib/apiHelpers";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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
  const counts = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countByName = Object.fromEntries(counts.map((c) => [c._id, c.count]));
  const docs = await Category.find({}).lean();
  const byName = Object.fromEntries(docs.map((d) => [d.name, d]));

  const allNames = Array.from(
    new Set([...Object.keys(countByName), ...docs.map((d) => d.name)])
  ).sort();

  const categories = allNames.map((name) => ({
    name,
    slug: byName[name]?.slug || buildSlug(name),
    image: byName[name]?.image || null,
    productCount: countByName[name] || 0,
    inUse: (countByName[name] || 0) > 0,
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

    const existing = await Category.findOne({ name });
    if (!existing && !files.image) {
      const category = await Category.create({ name, slug: buildSlug(name) });
      return ok({ category }, 201);
    }

    if (!files.image) {
      return ok({ category: existing });
    }

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
    if (e.code === 11000) return err("A category with this name already exists");
    return err("Failed to save category", 500);
  }
}


// Rename a category. Cascades the new name to every product using it.
export async function PUT(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { name, newName } = await request.json();
    const oldName = name?.trim();
    const nextName = newName?.trim();
    if (!oldName || !nextName) return err("Current and new category name are required");
    if (oldName === nextName) return ok({ category: { name: oldName } });

    await connectDB();

    const [doc, productCount, productNames, docs] = await Promise.all([
      Category.findOne({ name: oldName }),
      Product.countDocuments({ category: oldName }),
      Product.distinct("category"),
      Category.find({}).select("name").lean(),
    ]);
    if (!doc && productCount === 0) return err("Category not found", 404);

    // Reject a clash with ANOTHER category (same name or same URL slug)
    const nextSlug = buildSlug(nextName);
    if (!nextSlug) return err("Category name must contain letters or numbers");
    const others = new Set([...productNames, ...docs.map((d) => d.name)]);
    others.delete(oldName);
    for (const other of others) {
      if (other === nextName || buildSlug(other) === nextSlug) {
        return err(`A category named "${other}" already exists`, 409);
      }
    }

    // Category doc first: if it fails (e.g. unique index), no products were touched.
    let category;
    if (doc) {
      doc.name = nextName;
      doc.slug = nextSlug;
      await doc.save();
      category = doc;
    } else {
      category = { name: nextName, slug: nextSlug, image: null };
    }

    const { modifiedCount } = await Product.updateMany(
      { category: oldName },
      { $set: { category: nextName } }
    );

    try {
      revalidatePath(`/categories/${buildSlug(oldName)}`);
      revalidatePath(`/categories/${nextSlug}`);
    } catch {}

    return ok({ category, updatedProducts: modifiedCount });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) return err("A category with this name already exists", 409);
    return err("Failed to update category", 500);
  }
}

// DELETE body: { name, imageOnly? }
//  - imageOnly: true  -> just removes the image, category stays
//  - otherwise        -> deletes the category entirely (blocked if products use it)
export async function DELETE(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { name, imageOnly } = await request.json();
    if (!name) return err("Category name is required");

    await connectDB();
    const existing = await Category.findOne({ name });

    if (imageOnly) {
      if (!existing) return ok({ message: "Nothing to remove" });
      if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId);
      existing.image = undefined;
      existing.imagePublicId = undefined;
      await existing.save();
      return ok({ message: "Category image removed" });
    }

    const productCount = await Product.countDocuments({ category: name });
    if (productCount > 0) {
      return err(
        `Can't delete "${name}" — ${productCount} product${productCount === 1 ? " is" : "s are"} still in it. Move or delete those products first.`,
        409
      );
    }
    if (!existing) return err("Category not found", 404);

    if (existing.imagePublicId) await deleteFromCloudinary(existing.imagePublicId);
    await Category.deleteOne({ name });

    try {
      revalidatePath(`/categories/${existing.slug || buildSlug(name)}`);
    } catch {}

    return ok({ message: "Category deleted" });
  } catch (e) {
    console.error(e);
    return err("Failed to delete category", 500);
  }
}