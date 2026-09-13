import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

export async function PUT(request) {
  const { user: authUser, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, email, address, billingAddress, gstNumber } = body;

    await connectDB();
    const user = await User.findById(authUser._id);
    if (!user) return err("User not found", 404);

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (address !== undefined) user.address = address;
    if (billingAddress !== undefined) user.billingAddress = billingAddress;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;

    await user.save();

    return ok({
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
    return err("Failed to update profile", 500);
  }
}
