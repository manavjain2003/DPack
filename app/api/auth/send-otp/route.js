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

    // Generate 6-digit OTP
    // In production, integrate Twilio / MSG91 / Fast2SMS here
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this mobile
    await Otp.deleteMany({ mobile: cleaned });

    // Save new OTP (TTL index will auto-expire in 5 min)
    await Otp.create({ mobile: cleaned, otp });

    // TODO: Send SMS via your provider
    // await sendSMS(cleaned, `Your DPack OTP is ${otp}. Valid for 5 minutes.`);

    console.log(`[DEV] OTP for ${cleaned}: ${otp}`); // Remove in production

    return ok({
      message: "OTP sent successfully",
      // In dev, we expose the OTP so you can test without an SMS gateway:
      ...(process.env.NODE_ENV === "development" && { devOtp: otp }),
    });
  } catch (e) {
    console.error(e);
    return err("Failed to send OTP", 500);
  }
}
