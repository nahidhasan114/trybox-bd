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
            <h3 className="text-lg font-semibold text-foreground">{settings.business_name}</h3>
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
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              <li><Link href="/" className="transition-colors hover:text-primary-700">Home</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-primary-700">Shop</Link></li>
              <li><Link href="/shop?offer=1" className="transition-colors hover:text-primary-700">Offers</Link></li>
              <li><Link href="/shop?new=1" className="transition-colors hover:text-primary-700">New Arrivals</Link></li>
              <li><Link href="/shop?best=1" className="transition-colors hover:text-primary-700">Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Customer Care</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              <li><Link href="/contact" className="transition-colors hover:text-primary-700">Contact</Link></li>
              <li><Link href="/track-order" className="transition-colors hover:text-primary-700">Order Tracking</Link></li>
              <li><Link href="/delivery-policy" className="transition-colors hover:text-primary-700">Delivery Policy</Link></li>
              <li><Link href="/return-policy" className="transition-colors hover:text-primary-700">Return Policy</Link></li>
              <li><Link href="/privacy-policy" className="transition-colors hover:text-primary-700">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-primary-700">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/60">
              {(categories ?? []).map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className="transition-colors hover:text-primary-700">
                    {c.name_bn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-foreground/50">
            © {year} {settings.business_name} — All rights reserved
          </p>
          <div className="flex items-center gap-3">
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700">
                <Phone className="size-4" />
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700">
                <Mail className="size-4" />
              </a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700">
                <FacebookIcon className="size-4" />
              </a>
            )}
            {settings.messenger_url && (
              <a href={settings.messenger_url} target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full bg-surface-muted text-foreground/70 transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700">
                <MessageCircle className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
