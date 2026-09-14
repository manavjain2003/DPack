import { connectDB } from "@/lib/db/mongoose";
import Otp from "@/lib/models/Otp";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";
import { ok, err } from "@/lib/apiHelpers";

export async function POST(request) {
  try {
    const { mobile, otp } = await request.json();
    const cleaned = String(mobile || "").replace(/\D/g, "").slice(-10);

    if (cleaned.length !== 10) return err("Invalid mobile number");
    if (!otp || String(otp).length !== 6) return err("Invalid OTP format");

    await connectDB();

    const record = await Otp.findOne({ mobile: cleaned });
    if (!record) return err("OTP expired or not found. Request a new one.");
    if (record.otp !== String(otp).trim()) return err("Invalid OTP");

    await Otp.deleteMany({ mobile: cleaned });

    let user = await User.findOne({ mobile: cleaned });
    if (!user) {
      user = await User.create({
        mobile: cleaned,
        name: `User ${cleaned.slice(-4)}`,
      });
    }
    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken({ userId: user._id, role: user.role });

    return ok({
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        billingAddress: user.billingAddress,
        gstNumber: user.gstNumber,
      },
    });
  } catch (e) {
    console.error(e);
    return err("Verification failed", 500);
  }
}
