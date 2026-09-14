import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    specs: [{ type: String }],
    sizes: [{ type: String }],
    image: { type: String, required: true },
    imagePublicId: { type: String }, 
    extraImages: [{ type: String }],
    extraImagePublicIds: [{ type: String }],
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    featured: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

ProductSchema.virtual("stockStatus").get(function () {
  if (!this.trackInventory) return "in_stock";
  if (this.stock <= 0) return "out_of_stock";
  if (this.stock <= this.lowStockThreshold) return "low_stock";
  return "in_stock";
});

ProductSchema.set("toJSON", { virtuals: true });

const ProductModel =
  (mongoose.models && mongoose.models.Product) ||
  mongoose.model("Product", ProductSchema);

export default ProductModel;