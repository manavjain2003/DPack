import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { requireAdmin, ok, err, parseFormData } from "@/lib/apiHelpers";
import { uploadToCloudinary, uploadVideoToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;
  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) return err("Product not found", 404);
  return ok({ product });
}

export async function PUT(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return err("Product not found", 404);

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseFormData(request);

      if (files.image) {
        if (product.imagePublicId) {
          await deleteFromCloudinary(product.imagePublicId);
        }
        const { url, public_id } = await uploadToCloudinary(
          files.image.buffer,
          "dpack/products"
        );
        product.image = url;
        product.imagePublicId = public_id;
      }

      for (let i = 0; i < 10; i++) {
        const key = `extraImage_${i}`;
        if (files[key]) {
          const res = await uploadToCloudinary(files[key].buffer, "dpack/products");
          product.extraImages = product.extraImages || [];
          product.extraImagePublicIds = product.extraImagePublicIds || [];
          product.extraImages.push(res.url);
          product.extraImagePublicIds.push(res.public_id);
        }
      }

      // Handle video upload/replace
      if (files.video) {
        if (product.videoPublicId) {
          await deleteFromCloudinary(product.videoPublicId, "video");
        }
        const videoRes = await uploadVideoToCloudinary(files.video.buffer, "dpack/products");
        product.video = videoRes.url;
        product.videoPublicId = videoRes.public_id;
      }
      // Allow admin to clear the video
      if (fields.removeVideo === "true" && product.videoPublicId) {
        await deleteFromCloudinary(product.videoPublicId, "video");
        product.video = null;
        product.videoPublicId = null;
      }

      const specs = [].concat(fields.specs || []).filter(Boolean);
      const sizes = [].concat(fields.sizes || []).filter(Boolean);

      if (fields.name) product.name = fields.name;
      if (fields.slug) product.slug = fields.slug;
      if (fields.category) product.category = fields.category;
      if (fields.description) product.description = fields.description;
      if (specs.length) product.specs = specs;
      if (sizes.length) product.sizes = sizes;
      if (fields.price) product.price = parseFloat(fields.price);
      if (fields.compareAtPrice !== undefined)
        product.compareAtPrice = fields.compareAtPrice
          ? parseFloat(fields.compareAtPrice)
          : null;
      if (fields.featured !== undefined)
        product.featured = fields.featured === "true";
      if (fields.stock !== undefined)
        product.stock = parseInt(fields.stock);
      if (fields.lowStockThreshold !== undefined)
        product.lowStockThreshold = parseInt(fields.lowStockThreshold);
      if (fields.trackInventory !== undefined)
        product.trackInventory = fields.trackInventory !== "false";
      if (fields.isActive !== undefined)
        product.isActive = fields.isActive !== "false";
      if (fields.metaTitle !== undefined) product.metaTitle = fields.metaTitle;
      if (fields.metaDescription !== undefined)
        product.metaDescription = fields.metaDescription;
    } else {
      const body = await request.json();
      Object.assign(product, body);
    }

    await product.save();
    return ok({ product });
  } catch (e) {
    console.error(e);
    return err("Failed to update product", 500);
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) return err("Product not found", 404);

    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }
    for (const pid of product.extraImagePublicIds || []) {
      await deleteFromCloudinary(pid);
    }
    if (product.videoPublicId) {
      await deleteFromCloudinary(product.videoPublicId, "video");
    }

    await product.deleteOne();
    return ok({ message: "Product deleted" });
  } catch (e) {
    console.error(e);
    return err("Failed to delete product", 500);
  }
}