import { connectDB } from "@/lib/db/mongoose";
import { ok, err } from "@/lib/apiHelpers";
import { signToken } from "@/lib/jwt";


export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "dpack@admin123";

    if (
      username?.trim() !== validUsername ||
      password !== validPassword
    ) {
      await new Promise((r) => setTimeout(r, 800));
      return err("Invalid username or password", 401);
    }

    await connectDB();

    const User = (await import("@/lib/models/User")).default;

    let admin = await User.findOne({ role: "admin" });
    if (!admin) {
      admin = await User.create({
        mobile: "0000000000",
        name: validUsername,
        role: "admin",
      });
    }

    const token = signToken({ userId: admin._id, role: "admin" });

    return ok({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        mobile: admin.mobile,
        role: admin.role,
      },
    });
  } catch (e) {
    console.error(e);
    return err("Login failed", 500);
  }
}