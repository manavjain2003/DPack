import { connectDB } from "@/lib/db/mongoose";
import Otp from "@/lib/models/Otp";
import { ok, err } from "@/lib/apiHelpers";

export async function POST(request) {
  try {
    const { mobile } = await request.json();
    const cleaned = String(mobile || "").replace(/\D/g, "").slice(-10);
    if (cleaned.length !== 10) {
      return err("Enter a valid 10-digit mobile number");
    }

    await connectDB();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ mobile: cleaned });

    await Otp.create({ mobile: cleaned, otp });


    console.log(`[DEV] OTP for ${cleaned}: ${otp}`); // Remove in production

    return ok({
      message: "OTP sent successfully",
      devOtp: otp,
    });
  } catch (e) {
    console.error(e);
    return err("Failed to send OTP", 500);
  }
}