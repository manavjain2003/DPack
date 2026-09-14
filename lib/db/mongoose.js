import mongoose from "mongoose";

const MONGODB_URI_URL = process.env.MONGODB_URI;

if (!MONGODB_URI_URL) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
