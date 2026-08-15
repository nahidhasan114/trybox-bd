"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImage, type UploadBucket } from "@/lib/supabase/upload";
import { cn } from "@/lib/utils";

export function ImageUploader({
  bucket,
  value,
  onChange,
  label,
  aspect = "square",
}: {
  bucket: UploadBucket;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(bucket, file);
      onChange(url);
    } catch {
      toast.error("ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && <p className="mb-1.5 text-sm font-medium text-foreground/80">{label}</p>}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-surface-muted",
          aspect === "square" ? "aspect-square w-32" : "aspect-video w-full max-w-md",
        )}
      >
        {value ? (
          <>
            <Image src={value} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-1.5 p-4 text-foreground/50 hover:text-foreground/70"
          >
            {uploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
            <span className="text-xs">{uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}</span>
          </button>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1.5 text-xs font-medium text-primary-600 hover:underline"
        >
          ছবি পরিবর্তন করুন
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
