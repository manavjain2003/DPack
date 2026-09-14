import Razorpay from "razorpay";

let instance;

export function getRazorpay() {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET"
      );
    }
    instance = new Razorpay({ key_id, key_secret });
  }
  return instance;
}