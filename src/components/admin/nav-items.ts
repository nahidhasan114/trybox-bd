import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Tags,
  Boxes,
  Image,
  TicketPercent,
  Users,
  Star,
  BarChart3,
  Settings,
  ShieldCheck,
  Truck,
  Contact,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  ownerOnly?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
  { label: "অর্ডার", href: "/admin/orders", icon: ShoppingBag },
  { label: "প্রোডাক্ট", href: "/admin/products", icon: Package },
  { label: "ক্যাটাগরি", href: "/admin/categories", icon: FolderTree },
  { label: "ব্র্যান্ড", href: "/admin/brands", icon: Tags },
  { label: "ইনভেন্টরি", href: "/admin/inventory", icon: Boxes },
  { label: "ব্যানার", href: "/admin/banners", icon: Image },
  { label: "কুপন", href: "/admin/coupons", icon: TicketPercent },
  { label: "শিপিং", href: "/admin/shipping", icon: Truck },
  { label: "কাস্টমার", href: "/admin/customers", icon: Users },
  { label: "রিভিউ", href: "/admin/reviews", icon: Star },
  { label: "রিপোর্ট", href: "/admin/reports", icon: BarChart3 },
  { label: "টিম / আমাদের সম্পর্কে", href: "/admin/team", icon: Contact },
  { label: "সেটিংস", href: "/admin/settings", icon: Settings },
  { label: "অ্যাডমিন ইউজার", href: "/admin/admins", icon: ShieldCheck, ownerOnly: true },
];
