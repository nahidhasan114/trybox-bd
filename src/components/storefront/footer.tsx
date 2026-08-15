import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { FacebookIcon } from "@/components/icons/facebook-icon";

export async function Footer() {
  const supabase = await createClient();
  const [settings, { data: categories }] = await Promise.all([
    getSiteSettings(),
    supabase.from("categories").select("name_bn, slug").eq("is_active", true).order("display_order").limit(8),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{settings.business_name_bn}</h3>
            <p className="mt-2 text-sm text-foreground/60">
              বাংলাদেশের বিশ্বস্ত বেবি ও মাদার কেয়ার প্রোডাক্টের অনলাইন শপ।
            </p>
            {settings.address && (
              <p className="mt-3 flex items-start gap-2 text-sm text-foreground/60">
                <MapPin className="mt-0.5 size-4 shrink-0" /> {settings.address}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">দ্রুত লিংক</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              <li><Link href="/" className="hover:text-primary-700">হোম</Link></li>
              <li><Link href="/shop" className="hover:text-primary-700">শপ</Link></li>
              <li><Link href="/shop?offer=1" className="hover:text-primary-700">অফার</Link></li>
              <li><Link href="/shop?new=1" className="hover:text-primary-700">নতুন পণ্য</Link></li>
              <li><Link href="/shop?best=1" className="hover:text-primary-700">বেস্ট সেলার</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">কাস্টমার কেয়ার</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              <li><Link href="/contact" className="hover:text-primary-700">যোগাযোগ</Link></li>
              <li><Link href="/track-order" className="hover:text-primary-700">অর্ডার ট্র্যাকিং</Link></li>
              <li><Link href="/delivery-policy" className="hover:text-primary-700">ডেলিভারি নীতি</Link></li>
              <li><Link href="/return-policy" className="hover:text-primary-700">রিটার্ন নীতি</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary-700">প্রাইভেসি পলিসি</Link></li>
              <li><Link href="/terms" className="hover:text-primary-700">শর্তাবলী</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">ক্যাটাগরি</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              {(categories ?? []).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="hover:text-primary-700">
                    {c.name_bn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-foreground/50">
            © {year} {settings.business_name_bn} — সর্বস্বত্ব সংরক্ষিত
          </p>
          <div className="flex items-center gap-3">
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 hover:bg-primary-50 hover:text-primary-700">
                <Phone className="size-4" />
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 hover:bg-primary-50 hover:text-primary-700">
                <Mail className="size-4" />
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 hover:bg-primary-50 hover:text-primary-700">
                <FacebookIcon className="size-4" />
              </a>
            )}
            {settings.messenger_url && (
              <a href={settings.messenger_url} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 hover:bg-primary-50 hover:text-primary-700">
                <MessageCircle className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
