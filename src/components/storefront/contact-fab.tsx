import { getSiteSettings } from "@/lib/site-settings";
import { ContactFabClient } from "./contact-fab-client";

export async function ContactFab() {
  const settings = await getSiteSettings();
  const whatsapp = settings.whatsapp_number.replace(/\D/g, "");

  if (!whatsapp && !settings.messenger_url) return null;

  return (
    <ContactFabClient
      whatsappNumber={whatsapp}
      messengerUrl={settings.messenger_url}
      businessName={settings.business_name}
    />
  );
}
