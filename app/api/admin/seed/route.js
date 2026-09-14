import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { ok, err } from "@/lib/apiHelpers";

const SEED_PRODUCTS = [
  {
    slug: "dunnage-air-bags",
    name: "Dunnage Air Bags",
    category: "Dunnage Bag",
    description: "High-strength inflatable bags designed to fill gaps and securely stabilize cargo during transportation.",
    specs: ["Size/Dimension: 900x1800 mm", "Load Capacity: Up to 500 kg", "Bag Size: 900×1200 mm", "Usage/Application: Transport Loading Securing"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/74962d5d-6795-4ef3-a981-15c1c0bc7b17.webp",
    price: 200, featured: true, stock: 100,
  },
  {
    slug: "paper-dunnage-air-bag",
    name: "Paper Dunnage Air Bag",
    category: "Dunnage Bag",
    description: "Eco-friendly kraft paper air bags that provide reliable cushioning and load stability in transit.",
    specs: ["Size/Dimension: 900x1800 mm", "Color: Brown", "Usage/Application: Coils", "Design Type: Printed"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/79940279-2605-47c7-8f41-29c4208c4ec2.webp",
    price: 200, featured: false, stock: 100,
  },
  {
    slug: "paper-dunnage-bag-container-shipping",
    name: "Paper Dunnage Bag for Container Shipping",
    category: "Dunnage Bag",
    description: "High-performance paper dunnage bags for container shipping designed to secure cargo and prevent movement during transit.",
    specs: ["Usage/Application: Transport Loading Securing", "Color: Brown", "Air Tight: Yes", "Size: 600 X 900 mm"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/ac27c186-00a4-4a0e-ace6-24ae3039e43e.webp",
    price: 230, featured: false, stock: 100,
  },
  {
    slug: "dunnage-bag-shipping-containers",
    name: "Dunnage Bag for Shipping Containers",
    category: "Dunnage Bag",
    description: "Heavy-duty air bags used to prevent cargo shifting and damage in container shipments.",
    specs: ["Size/Dimension: 900*1200 mm", "Usage/Application: Packaging", "Material: Paper", "Model Name/Number: DD001"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/db2c5a71-e605-48dc-b4ab-a58484a99586.webp",
    price: 210, featured: false, stock: 100,
  },
  {
    slug: "pp-dunnage-bag",
    name: "PP Dunnage Bag",
    category: "Dunnage Bag",
    description: "Durable PP dunnage bags for quick, safe, and easy filling and cargo securing.",
    specs: ["Size: 900x1800 mm", "Color: White And Blue", "Usage/Application: Packaging", "Design Type: Printed"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/f975254f-2446-4ff8-b0aa-3ad8433295de.webp",
    price: 220, featured: false, stock: 100,
  },
  {
    slug: "dunnage-bag-manufacturer",
    name: "Dunnage Bag Manufacturer",
    category: "Dunnage Bag",
    description: "Trusted manufacturer offering high-quality, customizable dunnage bags for industrial packaging needs.",
    specs: ["Minimum Order Quantity: 1000 Piece", "Size/Dimension: 900x1800 mm", "Usage/Application: Transport Loading Securing", "Material: Paper"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/8b85b1d7-ea1f-4d32-86d8-a5a05533f656.webp",
    price: 195, featured: false, stock: 100,
  },
  {
    slug: "polypropylene-dunnage-air-bag",
    name: "Polypropylene Dunnage Air Bag",
    category: "Dunnage Bag",
    description: "Strong PP-based inflatable bags ideal for stabilizing heavy loads during long-distance transport.",
    specs: ["Size/Dimension: 600x600 mm", "Color: Brown", "Usage/Application: Wooden Furniture", "Design Type: Plain"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/79027b42-5d82-405e-8c11-445b0bff9519.webp",
    price: 225, featured: false, stock: 100,
  },
  {
    slug: "square-dunnage-air-bags",
    name: "Square Dunnage Air Bags",
    category: "Dunnage Bag",
    description: "Uniform square-shaped air bags designed for effective gap filling and load distribution.",
    specs: ["Minimum Order Quantity: 50 Piece", "Material: PP", "Working Pressure: Regulated & filtered air pressure @ 90 PSI", "Capacity: 5 Ton"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/32d98d08-2093-426d-88d3-2fbc0fbaa255.webp",
    price: 220, featured: false, stock: 100,
  },
  {
    slug: "dunnage-bags-air-bags",
    name: "Dunnage Bags Air Bags",
    category: "Dunnage Bag",
    description: "Versatile inflatable air bags suitable for securing and protecting various types of cargo.",
    specs: ["Size/Dimension: 900 x 1200 mm", "Material: Paper", "Color: Brown", "Design Type: Printed"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/f3e45b31-9e4c-42bb-807f-077268e91474.webp",
    price: 215, featured: false, stock: 100,
  },

  {
    slug: "perfume-packaging-air-column-roll",
    name: "Perfume Packaging Air Column Roll",
    category: "Air Column Roll",
    description: "Protective air column rolls designed to safeguard delicate perfume bottles from breakage.",
    specs: ["Roll Width: 200 mm", "Roll Height: 450 mm (18 inch)", "Length: 200 M", "Air Column Thickness: 40 µm"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/9fd7818b-19a0-47fe-a1a6-534259b8889b.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "air-tubes-rolls",
    name: "Air Tubes Rolls",
    category: "Air Column Roll",
    description: "Flexible inflatable tube rolls providing excellent cushioning and shock absorption for fragile goods.",
    specs: ["Roll Height: 600 mm (24 inch)", "Length: 500 m", "Usage/Application: Wooden Furniture", "Design Type: pipe"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/c13396d9-ea95-4255-b562-33442d75c801.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "air-column-cushion-roll",
    name: "Air Column Cushion Roll",
    category: "Air Column Roll",
    description: "Flexible inflatable cushion rolls providing excellent cushioning and shock absorption for fragile goods.",
    specs: ["Color: Transparent", "Material: Plastic", "Pattern: Plain", "Usage/Application: Packaging"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/e3d148d2-e461-40a5-b80c-04597b3ee48e.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "air-cushion-film-roll",
    name: "Air Cushion Film Roll",
    category: "Air Column Roll",
    description: "Lightweight air cushion film rolls ideal for void filling and protective packaging solutions.",
    specs: ["Roll Height: 400 mm", "Size: ALL", "Film Material: NYLON", "Bubble Type: Air Column"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/9fa22b69-48ab-474b-89ff-98ba655e29b8.webp",
    price: 480, featured: true, stock: 150,
  },
  {
    slug: "inflatable-air-column-roll",
    name: "Inflatable Air Column Roll",
    category: "Air Column Roll",
    description: "Durable inflatable rolls designed for wrapping and protecting delicate and valuable items.",
    specs: ["Length: 5 m", "Color: Transparent", "Usage/Application: Packing", "Sheet Thickness: 2 mm"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/33f8101a-ea03-4ddb-bce1-10d8c2f6a157.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "air-tube-column-roll",
    name: "Air Tube Column Roll",
    category: "Air Column Roll",
    description: "Multi-column air tube rolls ensuring enhanced protection against shocks during transit.",
    specs: ["Minimum Order Quantity: 1 Piece", "Roll Weight: 25 kg", "Column Width: 30 mm", "Perforation: Non-Perforated"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/9343795e-a711-4a1d-b192-869602ee9397.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "jam-bottle-air-column-roll",
    name: "Jam Bottle Air Column Roll",
    category: "Packaging Air Bag",
    description: "Specially designed air column rolls to securely protect jam bottles during shipping.",
    specs: ["Bag Type: Bottle", "Size: 4 in * 6 in", "Air Column Thickness: 70 m", "Material: LDPE+Nylon"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/60b4a4dd-338b-4174-b762-709e891c270d.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "glass-bottle-air-column-roll",
    name: "Glass Bottle Air Column Roll",
    category: "Air Column Roll",
    description: "High-performance air rolls that prevent breakage of glass bottles in transit.",
    specs: ["Bag Type: Glass", "Size: 7 in * 8 in", "Air Column Thickness: 70 m", "Material: LDPE+Nylon"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/977b4508-87c6-49a6-ab51-103bc1f59cca.webp",
    price: 465, featured: false, stock: 100,
  },
  {
    slug: "packaging-column-airbag-roll",
    name: "Packaging Column Airbag Roll",
    category: "Air Column Roll",
    description: "Inflatable airbag rolls used for cushioning and stabilizing packaged products.",
    specs: ["Color: Transparent", "Material: Plastic", "Pattern: Plain", "Usage/Application: Packaging"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/6ce0fd60-7608-4cb8-839d-fc5b1ae364ed.webp",
    price: 460, featured: false, stock: 100,
  },
  {
    slug: "inflatable-wrapping-column-plastic-film-air-bag-roll-packing",
    name: "Inflatable Wrapping Column Plastic Film Air Bag Roll Packing",
    category: "Air Column Roll",
    description: "Multi-layer inflatable film rolls offering secure wrapping and impact protection.",
    specs: ["Length: 12", "Roll Weight: 25 kg", "Column Width: 30 mm", "Perforation: Non-Perforated"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/4a54ce20-5775-49af-9278-9eda204ee69f.webp",
    price: 450, featured: false, stock: 100,
  },
  {
    slug: "air-bubble-packaging-film-roll",
    name: "Air Bubble Packaging Film Roll",
    category: "Air Column Roll",
    description: "Air bubble packaging film rolls designed for effective cushioning, shock absorption, and surface protection.",
    specs: ["Thickness (GSM): 50 GSM", "Bubble Size: 10 mm", "Sheet Length (per roll): 50 meter", "Color: White"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/e7323100-e0a3-4961-958a-c10c2bf95585.webp",
    price: 480, featured: false, stock: 80,
  },

  {
    slug: "air-column-bag-laptop",
    name: "Air Column Bag for Laptop",
    category: "Air Column Bag",
    description: "Shockproof air column bags designed to protect laptops from impact and vibration during shipping.",
    specs: ["Bag Type: Single Laptop Bag", "Size: 15 in × 18 in", "Air Column Thickness: 70 m", "Material: LDPE+Nylon"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/cd051810-7728-4141-b043-d6658b7b0a81.webp",
    price: 500, featured: true, stock: 200,
  },
  {
    slug: "air-column-bags-electronics",
    name: "Air Column Bags for Electronics",
    category: "Air Column Bag",
    description: "Shockproof air column bags designed to protect electronics from impact and vibration during shipping.",
    specs: ["Bag Type: Fragile Item Bag", "Size: 8 in * 11 in", "Air Column Thickness: 70 m", "Material: LDPE+Nylon"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/1f534594-0eb6-45d4-9826-8e88c6054208.webp",
    price: 500, featured: false, stock: 200,
  },
  {
    slug: "air-column-cushion-bag-wine",
    name: "Air Column Cushion Bag for Wine",
    category: "Air Column Bag",
    description: "Protective air bags that secure wine bottles and prevent damage during transport.",
    specs: ["Bag Type: Wine Bottle Bag", "Size: 10 in × 12 in", "Air Column Thickness: 70 m", "Material: LDPE+Nylon"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/d7108cda-8bf4-4405-b8d7-4cb50b6e38be.webp",
    price: 460, featured: false, stock: 200,
  },
  {
    slug: "transparent-air-column-bag-macbook",
    name: "Transparent Air Column Bag for Mac Book, For Safe Packaging",
    category: "Air Column Bag",
    description: "Specialized transparent air bags designed to protect MacBooks and laptops for safe packaging.",
    specs: ["Capacity: 100 Ton", "Color: Transparent", "Brand: D Pack", "Usage/Application: Safe Packaging"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/4c0a151e-aea5-4be3-b69f-2fa44defd4fa.webp",
    price: 460, featured: false, stock: 200,
  },
  {
    slug: "air-column-packaging-bag",
    name: "Air Column Packaging Bag",
    category: "Air Column Bag",
    description: "Reliable air column packaging bags for safe and secure shipment of fragile goods.",
    specs: ["Material: LDPE+Nylon", "Color: Transparent", "Usage/Application: Packaging"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/air-column-packaging-bag.webp",
    price: 480, featured: false, stock: 200,
  },

  {
    slug: "shoes-packing-air-cushion-bag",
    name: "Shoes Packing Air Cushion Bag",
    category: "Packaging Air Bag",
    description: "Air cushion bags designed to protect shoes from dust, pressure, and damage during shipping.",
    specs: ["Size: 200 X 200", "Brand: D Pack", "Color: Transparent", "Usage/Application: Packaging"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/71cf48ca-73e9-4a59-abad-637c3f405301.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "self-inflated-packaging-air-bag",
    name: "Self-Inflated Packaging Air Bag",
    category: "Packaging Air Bag",
    description: "Innovative air bags that automatically inflate for fast and convenient packaging solutions.",
    specs: ["Color: Transparent", "Usage/Application: Packaging", "Pattern: Plain", "Material: Plastic"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/7fa05c95-02ee-4a74-8755-7618e7aa8863.webp",
    price: 500, featured: true, stock: 300,
  },
  {
    slug: "protective-air-tube-bag-jars-containers",
    name: "Protective Air Tube Bag Packaging for Jars & Containers",
    category: "Packaging Air Bag",
    description: "Air tube bags offering secure cushioning for jars and container packaging.",
    specs: ["Color: Transparent", "Usage/Application: Electronics and Glass", "Design Type: Plain", "Material: PVC"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/70d3e8a9-2fc3-44a5-8cc1-cf0b342a03a8.webp",
    price: 490, featured: false, stock: 300,
  },
  {
    slug: "glass-bottle-airbag-packaging",
    name: "Glass Bottle Airbag Packaging",
    category: "Packaging Air Bag",
    description: "Inflatable air bags designed to prevent breakage and ensure safe delivery of glass bottles.",
    specs: ["Film Material: Nylon Barrier", "Size: 500x500 mm", "Bubble Type: Air Column", "Pillow Size: 200×300 mm"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/724133f2-a242-46d4-bb6d-a48a5a98d241.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "inflatable-air-packaging-bags",
    name: "Inflatable Air Packaging Bags",
    category: "Packaging Air Bag",
    description: "Lightweight inflatable bags providing efficient cushioning and product protection during transit.",
    specs: ["Size: 500x500 mm", "Usage/Application: PACKAGING", "Design Type: TUBE", "Shape: Q SHAPE"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/95e1a246-1976-48b7-90ee-d5b7773c2a93.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "air-filled-cushioning-bag",
    name: "Air Filled Cushioning Bag",
    category: "Packaging Air Bag",
    description: "Soft air-filled bags that absorb shocks and protect goods from damage in shipping.",
    specs: ["Minimum Order Quantity: 5000 Piece", "Color: Transparent", "Usage/Application: Gap filling", "Shape: Square"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/c3c96937-68c9-4436-864d-f94fac526013.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "air-tube-bag-packaging",
    name: "Air Tube Bag for Packaging",
    category: "Packaging Air Bag",
    description: "Tube-style air bags designed for secure packaging and enhanced product safety.",
    specs: ["Size: 400X450 mm", "Brand: D pack", "Color: White", "Recyclable: Yes"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/03f8851c-81ba-4b35-8209-1cef4a2712dc.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "trolley-packaging-air-bag",
    name: "Trolley Packaging Air Bag",
    category: "Packaging Air Bag",
    description: "Protective air bags designed to safeguard trolley bags from scratches and impact.",
    specs: ["Country of Origin: Made in India", "Brand: D Pack"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/e63fe68e-ad31-47df-8d13-83902fb16c42.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "air-bag-packing-bag-in-bag",
    name: "Air Bag Packing Bag-in-Bag",
    category: "Packaging Air Bag",
    description: "Air bag packing (bag-in-bag) designed with air pillow technology to provide cushioning and shock absorption.",
    specs: ["Film Material: Plastic", "Bubble Type: Air Pillow", "Pillow Size: As per requirement", "Film Thickness: As per requirement"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/0666c31e-ba76-40ec-ab7b-ca83217f574c.webp",
    price: 500, featured: false, stock: 300,
  },

  {
    slug: "purse-gap-filler-pouch",
    name: "Purse Gap Filler Pouch",
    category: "Gap Filler",
    description: "Air-filled pouches used to fill empty spaces and protect purses from deformation during transit.",
    specs: ["Film Material: Nylon Barrier", "Bubble Type: Air Pillow", "Pillow Size: 200×300 mm", "Film Thickness: 70"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/03d71900-3b12-40d3-898c-5b8bf47ac454.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "white-air-cushion-void-filling-rolls",
    name: "White Air Cushion Void Filling Rolls Gap Filler",
    category: "Gap Filler",
    description: "White air cushion rolls ideal for filling voids and preventing product movement in packages.",
    specs: ["Minimum Order Quantity: 1 Roll", "Length: 200 m", "Sheet Weight: 30+30", "Design Type: Pouch"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/7fd4200c-33dd-49ab-8b1d-f9cdcc6040db.webp",
    price: 490, featured: false, stock: 150,
  },
  {
    slug: "void-gap-filling-air-cushion-bags",
    name: "Void or Gap Filling Air Cushion Bags",
    category: "Gap Filler",
    description: "Durable air bags designed to fill gaps and stabilize goods during transportation.",
    specs: ["Minimum Order Quantity: 5000 Piece", "Color: Transparent", "Usage/Application: Gap filling", "Shape: Square"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/07647cc7-6f09-4c55-a1e1-ee6110b54f35.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "gap-filler-pouch",
    name: "Gap Filler Pouch",
    category: "Gap Filler",
    description: "Inflatable pouches that effectively fill empty spaces and protect products from shifting and damage.",
    specs: ["Size: 200 mm x 200 mm", "Description: 125 pieces in 1 pack", "Brand: Dpack", "Lead Time: 2 Days"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/b1ebdcb9-a0e2-4906-875a-89ef35fa158b.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "inflatable-air-cushion-for-shoes",
    name: "Inflatable Air Cushion for Shoes",
    category: "Gap Filler",
    description: "Inflatable air cushions designed as gap fillers to protect shoes from deformation, scratches, and damage.",
    specs: ["Color: Transparent", "Usage/Application: Shoes Packing", "Shape: Rectangle", "Brand: D pack"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/d58e5a21-1cba-4f52-8517-564bbb793310.webp",
    price: 500, featured: false, stock: 300,
  },
  {
    slug: "rf-gap-filler-pouch",
    name: "RF Gap Filler Pouch",
    category: "Gap Filler",
    description: "RF gap filler pouches designed to fill empty spaces between products, providing air cushioning and protection.",
    specs: ["Pouch Type: Pillow Pouch", "Pouch Features: One way valve", "Pouch Finish: Matte", "Sealing Type: 3-Side Seal"],
    image: "https://pub-6773b48348124a078cb55322f384ad44.r2.dev/581e658b-fc36-4949-bfe5-a106f57c43ff.webp",
    price: 500, featured: false, stock: 300,
  },
];

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return err("Seed is disabled in production", 403);
  }

  try {
    await connectDB();

    const newSlugs = SEED_PRODUCTS.map((p) => p.slug);
    await Product.deleteMany({ slug: { $nin: newSlugs } });

    let created = 0;
    for (const p of SEED_PRODUCTS) {
      await Product.findOneAndUpdate({ slug: p.slug }, p, {
        upsert: true,
        new: true,
      });
      created++;
    }

    let admin = await User.findOne({ mobile: "9999999999" });
    if (!admin) {
      admin = await User.create({
        mobile: "9999999999",
        name: "Admin",
        role: "admin",
      });
    } else {
      admin.role = "admin";
      await admin.save();
    }

    return ok({
      message: `Seeded ${created} products. Admin mobile: 9999999999`,
    });
  } catch (e) {
    console.error(e);
    return err("Seed failed: " + e.message, 500);
  }
}