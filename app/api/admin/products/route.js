import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import { requireAdmin, ok, err, parseFormData } from "@/lib/apiHelpers";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ok({ products, total, page, limit });
  } catch (e) {
    console.error(e);
    return err("Failed to fetch products", 500);
  }
}

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    await connectDB();
    const { fields, files } = await parseFormData(request);

    if (!files.image) return err("Product image is required");

    const { url, public_id } = await uploadToCloudinary(
      files.image.buffer,
      "dpack/products"
    );

    const extraImages = [];
    const extraImagePublicIds = [];
    for (let i = 0; i < 10; i++) {
      const key = `extraImage_${i}`;
      if (files[key]) {
        const res = await uploadToCloudinary(files[key].buffer, "dpack/products");
        extraImages.push(res.url);
        extraImagePublicIds.push(res.public_id);
      }
    }

    const youtubeUrl = (fields.youtubeUrl || "").trim() || null;
    const instagramUrl = (fields.instagramUrl || "").trim() || null;

    const specs = [].concat(fields.specs || []).filter(Boolean);
    const sizes = [].concat(fields.sizes || []).filter(Boolean);
    const overview = [].concat(fields.overview || []).filter(Boolean);
    const keyFeatures = [].concat(fields.keyFeatures || []).filter(Boolean);
    const applications = [].concat(fields.applications || []).filter(Boolean);

    const product = await Product.create({
      name: fields.name,
      slug: fields.slug,
      category: fields.category,
      description: fields.description,
      overview,
      keyFeatures,
      applications,
      specs,
      sizes,
      image: url,
      imagePublicId: public_id,
      extraImages,
      extraImagePublicIds,
      youtubeUrl,
      instagramUrl,
      price: parseFloat(fields.price),
      compareAtPrice: fields.compareAtPrice
        ? parseFloat(fields.compareAtPrice)
        : null,
      featured: fields.featured === "true",
      stock: parseInt(fields.stock || "0"),
      lowStockThreshold: parseInt(fields.lowStockThreshold || "10"),
      trackInventory: fields.trackInventory !== "false",
      isActive: fields.isActive !== "false",
      metaTitle: fields.metaTitle || "",
      metaDescription: fields.metaDescription || "",
    });

    return ok({ product }, 201);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) return err("A product with this slug already exists");
    return err("Failed to create product", 500);
  }
}