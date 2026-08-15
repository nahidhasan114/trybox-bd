import { MessageCircle, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export async function ContactFab() {
  const settings = await getSiteSettings();
  const whatsapp = settings.whatsapp_number.replace(/\D/g, "");

  return (
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2.5">
      {settings.messenger_url && (
        <a
          href={settings.messenger_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Messenger"
        >
          <MessageCircle className="size-6" />
        </a>
      )}
      {whatsapp && (
        <a
          href={`https://wa.me/88${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          aria-label="WhatsApp"
        >
          <Phone className="size-6" />
        </a>
      )}
    </div>
  );
}
