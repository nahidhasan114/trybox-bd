import Image from "next/image";
import { Phone, Mail, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "আমাদের সম্পর্কে" };

export default async function AboutPage() {
  const supabase = await createClient();
  const [settings, { data: members }] = await Promise.all([
    getSiteSettings(),
    supabase.from("team_members").select("*").eq("is_active", true).order("display_order"),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-primary-50/70 via-white to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">আমাদের সম্পর্কে</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/60 sm:text-base">
            {settings.business_name} — বাংলাদেশের বিশ্বস্ত বেবি ও মাদার কেয়ার প্রোডাক্টের অনলাইন শপ। আপনার
            ছোট্ট সোনামণির জন্য সেরা মানের প্রোডাক্ট, সঠিক দামে, নির্ভরযোগ্য ডেলিভারির মাধ্যমে পৌঁছে দেওয়াই
            আমাদের লক্ষ্য।
          </p>
        </div>
      </section>

      {members && members.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="mb-6 flex items-center justify-center gap-2.5 text-center text-lg font-semibold text-foreground sm:text-xl">
            <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
            আমাদের টিম
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="group flex flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
              >
                <div className="relative size-28 overflow-hidden rounded-full bg-gradient-to-b from-primary-100 to-accent-100 p-1">
                  <div className="relative size-full overflow-hidden rounded-full bg-surface-muted">
                    {m.photo_url ? (
                      <Image src={m.photo_url} alt={m.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex size-full items-center justify-center text-foreground/25">
                        <UserRound className="size-10" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-base font-semibold text-foreground">{m.name}</p>
                {m.designation && (
                  <p className="mt-0.5 text-sm font-medium text-primary-700">{m.designation}</p>
                )}
                {m.bio && <p className="mt-2 text-sm text-foreground/60">{m.bio}</p>}
                {(m.phone || m.email) && (
                  <div className="mt-4 flex items-center gap-2">
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-all hover:-translate-y-0.5 hover:bg-primary-100"
                      >
                        <Phone className="size-4" />
                      </a>
                    )}
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="flex size-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-all hover:-translate-y-0.5 hover:bg-primary-100"
                      >
                        <Mail className="size-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
