import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { MegaMenu } from "./mega-menu";
import { MobileDrawer } from "./mobile-drawer";
import { NavSearch } from "./nav-search";
import { CartButton } from "./cart-button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Combo Offers", href: "/shop?type=combo" },
  { label: "New Arrivals", href: "/shop?new=1" },
  { label: "Best Sellers", href: "/shop?best=1" },
];

export async function Header() {
  const supabase = await createClient();
  const [settings, { data: categories }] = await Promise.all([
    getSiteSettings(),
    supabase
      .from("categories")
      .select("name_bn, slug")
      .eq("is_active", true)
      .order("display_order")
      .limit(12),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <MobileDrawer categories={categories ?? []} />

        <Link href="/" className="flex shrink-0 items-center gap-2">
          {settings.logo_url ? (
            <Image src={settings.logo_url} alt={settings.business_name_bn} width={36} height={36} unoptimized className="rounded-lg" />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              {settings.business_name_bn.slice(0, 1)}
            </span>
          )}
          <span className="hidden text-lg font-semibold text-foreground sm:inline">{settings.business_name_bn}</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary-700"
            >
              {l.label}
            </Link>
          ))}
          <MegaMenu categories={categories ?? []} />
        </nav>

        <div className="hidden flex-1 md:block">
          <NavSearch className="mx-auto max-w-md" />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/track-order"
            className="hidden size-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted sm:flex"
            aria-label="Account"
          >
            <User className="size-5 text-foreground/70" />
          </Link>
          <CartButton />
        </div>
      </div>

      <div className="border-t border-border px-4 py-2 md:hidden">
        <NavSearch />
      </div>
    </header>
  );
}
