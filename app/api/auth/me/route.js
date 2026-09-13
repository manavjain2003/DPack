import { requireAuth } from "@/lib/apiHelpers";
import { ok } from "@/lib/apiHelpers";

export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

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
}
