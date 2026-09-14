"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactFabClient({
  whatsappNumber,
  messengerUrl,
  businessName,
}: {
  whatsappNumber: string;
  messengerUrl: string;
  businessName: string;
}) {
  const [open, setOpen] = useState(false);

  const waLink = whatsappNumber
    ? `https://wa.me/88${whatsappNumber}?text=${encodeURIComponent(`Hi ${businessName}! আমার একটু সাহায্য দরকার।`)}`
    : null;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2.5">
      {open && waLink && (
        <div className="w-72 max-w-[85vw] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#25D366] to-[#1fb855] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white">
                <MessageCircle className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{businessName}</p>
                <p className="flex items-center gap-1 text-[11px] text-white/85">
                  <span className="size-1.5 rounded-full bg-emerald-300" /> সাধারণত দ্রুত উত্তর দেয়
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
              aria-label="বন্ধ করুন"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-2xl rounded-tl-sm bg-surface-muted px-3.5 py-2.5 text-sm text-foreground/80">
              👋 হ্যালো! {businessName}-তে স্বাগতম।
              <br />
              আমরা কীভাবে সাহায্য করতে পারি?
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#1fb855] text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
            >
              <Send className="size-4" /> WhatsApp-এ চ্যাট শুরু করুন
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Messenger"
          >
            <MessageCircle className="size-6" />
          </a>
        )}
        {waLink && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
            aria-label="WhatsApp"
          >
            {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/60" />}
            <span className="relative">
              {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
