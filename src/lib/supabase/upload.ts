"use client";

import { createClient } from "@/lib/supabase/client";

export type UploadBucket = "banners" | "branding" | "category-images" | "product-images" | "team-photos";

const MAX_DIMENSION = 1600;
const QUALITY = 0.85;

async function compressImage(file: File): Promise<{ blob: Blob; contentType: string; ext: string } | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return null;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    if (!blob) return null;
    return { blob, contentType: "image/webp", ext: "webp" };
  } catch {
    return null;
  }
}

export async function uploadImage(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createClient();
  const compressed = await compressImage(file);
  const ext = compressed?.ext ?? file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, compressed?.blob ?? file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: compressed?.contentType ?? file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
