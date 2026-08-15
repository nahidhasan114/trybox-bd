import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { FacebookIcon } from "@/components/icons/facebook-icon";

export const metadata = { title: "যোগাযোগ" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const items = [
    settings.phone && { icon: Phone, label: "ফোন", value: settings.phone, href: `tel:${settings.phone}` },
    settings.email && { icon: Mail, label: "ইমেইল", value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, label: "ঠিকানা", value: settings.address, href: undefined },
    settings.facebook_url && { icon: FacebookIcon, label: "Facebook", value: "আমাদের পেজ দেখুন", href: settings.facebook_url },
    settings.messenger_url && { icon: MessageCircle, label: "Messenger", value: "মেসেজ পাঠান", href: settings.messenger_url },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }[];

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold text-foreground">যোগাযোগ করুন</h1>
      <p className="mt-1 text-sm text-foreground/60">
        যেকোনো প্রশ্ন বা সহযোগিতার জন্য নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
      </p>

      <div className="mt-6 space-y-3">
        {items.map((item) => {
          const content = (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-xs text-foreground/50">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          );
          return item.href ? (
            <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
