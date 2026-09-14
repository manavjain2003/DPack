import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUD_FLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUD_FLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_FLARE_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.CLOUD_FLARE_R2_BUCKET;
const PUBLIC_URL = (process.env.CLOUD_FLARE_R2_PUBLIC_URL || "").replace(/\/$/, "");

/**
 * Upload an image buffer to Cloudflare R2.
 * Drop-in replacement for the old uploadToCloudinary().
 * @param {Buffer} buffer
 * @param {string} folder  e.g. "dpack/products"
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(buffer, folder = "dpack/products") {
  const key = `${folder}/${randomUUID()}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg", // R2 serves the file; MIME type is informational
    })
  );
  return { url: `${PUBLIC_URL}/${key}`, public_id: key };
}

/**
 * Upload a video buffer to Cloudflare R2.
 * Drop-in replacement for the old uploadVideoToCloudinary().
 * @param {Buffer} buffer
 * @param {string} folder  e.g. "dpack/products"
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadVideoToCloudinary(buffer, folder = "dpack/products") {
  const key = `${folder}/${randomUUID()}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "video/mp4",
    })
  );
  return { url: `${PUBLIC_URL}/${key}`, public_id: key };
}

/**
 * Delete an object from Cloudflare R2 by its key (public_id).
 * Drop-in replacement for the old deleteFromCloudinary().
 * The resourceType param is accepted but unused — R2 doesn't need it.
 * @param {string} publicId  The R2 object key stored as public_id
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) return;
  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: publicId,
    })
  );
}

export default r2;