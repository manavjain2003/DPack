import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dpack-dev-secret-change-in-prod";
const JWT_EXPIRY = "30d";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
