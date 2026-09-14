"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="bn">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827" }}>দুঃখিত, সাইটে একটা সমস্যা হয়েছে</h1>
          <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#6b7280" }}>
            অনুগ্রহ করে পেজটি আবার লোড করুন। সমস্যা থাকলে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
          <button
            onClick={reset}
            style={{
              borderRadius: "9999px",
              backgroundColor: "#1d4ed8",
              color: "#fff",
              padding: "0.625rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </body>
    </html>
  );
}
