import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";
import { connectDB } from "./db/mongoose";
import User from "./models/User";

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function err(message, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Parse bearer token from Authorization header */
export function getBearerToken(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/** Verify token and return the decoded payload, or null */
export function getAuthPayload(request) {
  const token = getBearerToken(request);
  if (!token) return null;
  return verifyToken(token);
}

/** Middleware: require a valid logged-in user */
export async function requireAuth(request) {
  const payload = getAuthPayload(request);
  if (!payload) return { error: err("Unauthorized", 401) };
  await connectDB();
  const user = await User.findById(payload.userId).lean();
  if (!user || !user.isActive) return { error: err("Unauthorized", 401) };
  return { user };
}

/** Middleware: require admin role */
export async function requireAdmin(request) {
  const result = await requireAuth(request);
  if (result.error) return result;
  if (result.user.role !== "admin") return { error: err("Forbidden", 403) };
  return result;
}

/** Parse multipart/form-data body into { fields, files } */
export async function parseFormData(request) {
  const formData = await request.formData();
  const fields = {};
  const files = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const buffer = Buffer.from(await value.arrayBuffer());
      files[key] = { buffer, name: value.name, type: value.type };
    } else {
      // Handle multi-value fields (e.g. specs[])
      if (fields[key] !== undefined) {
        fields[key] = [].concat(fields[key], value);
      } else {
        fields[key] = value;
      }
    }
  }
  return { fields, files };
}
