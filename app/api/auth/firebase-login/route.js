import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";
import { ok, err } from "@/lib/apiHelpers";
import { verifyFirebaseIdToken } from "@/lib/firebaseVerify";

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return err("Missing idToken");

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (e) {
      console.error("Firebase token verification failed:", e);
      return err("Invalid or expired login token", 401);
    }

    const phoneNumber = decoded.phone_number; 
    if (!phoneNumber) return err("No phone number on this account");

    const cleaned = phoneNumber.replace(/\D/g, "").slice(-10);
    if (cleaned.length !== 10) return err("Invalid mobile number");

    await connectDB();

    let user = await User.findOne({ mobile: cleaned });
    if (!user) {
      user = await User.create({
        mobile: cleaned,
        name: `User ${cleaned.slice(-4)}`,
      });
    }

    if (!user.isActive) return err("Account is disabled", 403);

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
    return err("Login failed", 500);
  }
}