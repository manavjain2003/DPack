
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { ok, err } from "@/lib/apiHelpers";

const SEED_PRODUCTS = [
  {
    slug: "corrugation-shredder-machine",
    name: "Cardboard Corrugation Shredder Machine",
    category: "Machines",
    description: "Turns waste cardboard into free, eco-friendly cushioning mat — cut disposal costs and never buy void fill again.",
    specs: ["Heavy-duty cutters", "Eco void-fill output"],
    image: "https://packingairbag.com/_next/image?url=%2Fshredder-machine.png&w=640&q=75",
    price: 185000, featured: true, stock: 5,
  },
  {
    slug: "air-cushion-machine",
    name: "Air Cushion Machine",
    category: "Machines",
    description: "The smart replacement for traditional bubble wrap rolls — produces air cushions on demand.",
    specs: ["On-demand cushions", "Low film cost"],
    image: "https://packingairbag.com/_next/image?url=%2Fair-cushion-machine.png&w=640&q=75",
    price: 95000, featured: true, stock: 8,
  },
  {
    slug: "air-cushion-film-roll",
    name: "Air Cushion Film Roll",
    category: "Films & Rolls",
    description: "Compatible film rolls for air cushion machines — continuous cushioning for high-volume packing lines.",
    specs: ["200 mm × 300 mm", "200 m · 3 pouches/m"],
    image: "https://packingairbag.com/_next/image?url=%2Fair-cushion-roll.png&w=640&q=75",
    price: 3200, featured: false, stock: 150,
  },
  {
    slug: "air-column-bags",
    name: "Air Column Bags",
    category: "Void Fill",
    description: "Protective air bags for safe & secure packaging — keep your shipments safe with self-inflated, shock-absorbing columns.",
    specs: ["7 sizes in stock", "120 mm → 240 mm widths"],
    sizes: ["120×180 · 85 pcs","180×230 · 90 pcs","210×300 · 52 pcs","210×330 · 42 pcs","210×375 · 38 pcs","240×375 · 35 pcs","240×415 · 28 pcs"],
    image: "https://packingairbag.com/_next/image?url=%2Fair-column-bags.png&w=640&q=75",
    price: 1450, featured: true, stock: 200,
  },
  {
    slug: "gap-fillers",
    name: "Gap Fillers",
    category: "Void Fill",
    description: "Lightweight inflatable pillows that fill empty space in cartons and stop goods from shifting in transit.",
    specs: ["100 mm × 200 mm", "260 pcs per pack"],
    image: "https://packingairbag.com/_next/image?url=%2Fgap-filler.png&w=640&q=75",
    price: 890, featured: false, stock: 300,
  },
  {
    slug: "honeycomb-sleeve",
    name: "Honeycomb Sleeves",
    category: "Wrap",
    description: "Stretchy kraft honeycomb that hugs bottles, jars and delicate surfaces — plastic-free protective wrap.",
    specs: ["Kraft paper", "Multiple lengths"],
    image: "https://packingairbag.com/_next/image?url=%2Fhoneycomb-sleeve.png&w=640&q=75",
    price: 1100, featured: true, stock: 120,
  },
  {
    slug: "air-bubble-roll",
    name: "Air Bubble Roll",
    category: "Wrap",
    description: "Self-inflated air bubble wrap — best for packing fragile items, with no pump required.",
    specs: ["440 mm width", "Self-inflating"],
    image: "https://packingairbag.com/_next/image?url=%2Fbubble-roll.png&w=640&q=75",
    price: 1650, featured: false, stock: 80,
  },
  {
    slug: "pallet-belts",
    name: "Reusable Pallet Belts",
    category: "Securing",
    description: "Secure your shipments with confidence — heavy-duty hook-and-loop belts.",
    specs: ["6 m length", "100 mm width"],
    image: "https://packingairbag.com/_next/image?url=%2Fpallet-belt.png&w=640&q=75",
    price: 780, featured: false, stock: 60,
  },
  {
    slug: "packaging-tapes",
    name: "Packaging Tapes",
    category: "Tapes",
    description: "Reliable packaging tapes for securely sealing cartons and parcels.",
    specs: ["Strong adhesion", "Carton sealing"],
    image: "https://packingairbag.com/_next/image?url=%2Fpackaging-tape.png&w=640&q=75",
    price: 85, featured: false, stock: 500,
  },
  {
    slug: "corrugated-boxes",
    name: "3 Ply Corrugated Boxes",
    category: "Boxes",
    description: "Sturdy single-wall cartons in multiple sizes — the dependable outer layer for every shipment.",
    specs: ["3 ply single wall", "Multiple sizes"],
    image: "https://packingairbag.com/_next/image?url=%2Fcorrugated-box.png&w=640&q=75",
    price: 28, featured: false, stock: 1000,
  },
];

export async function POST(request) {
  if (process.env.NODE_ENV === "production") {
    return err("Seed is disabled in production", 403);
  }

  try {
    await connectDB();

    // Seed products
    let created = 0;
    for (const p of SEED_PRODUCTS) {
      await Product.findOneAndUpdate({ slug: p.slug }, p, {
        upsert: true,
        new: true,
      });
      created++;
    }

    // Create demo admin
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
