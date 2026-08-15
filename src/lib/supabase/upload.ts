"use client";

import { createClient } from "@/lib/supabase/client";

export type UploadBucket = "banners" | "branding" | "category-images" | "product-images" | "team-photos";

export async function uploadImage(bucket: UploadBucket, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
