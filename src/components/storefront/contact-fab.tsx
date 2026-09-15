import { getSiteSettings } from "@/lib/site-settings";
import { ContactFabClient } from "./contact-fab-client";

export async function ContactFab() {
  const settings = await getSiteSettings();
  const channel = settings.contact_fab_channel;

  if (channel === "none") return null;

  if (channel === "whatsapp") {
    const whatsapp = settings.whatsapp_number.replace(/\D/g, "");
    if (!whatsapp) return null;
    return (
      <ContactFabClient channel="whatsapp" whatsappNumber={whatsapp} businessName={settings.business_name} />
    );
  }

  if (channel === "messenger") {
    if (!settings.messenger_url) return null;
    return <ContactFabClient channel="messenger" messengerUrl={settings.messenger_url} />;
  }

  if (!settings.phone) return null;
  return <ContactFabClient channel="phone" phone={settings.phone} />;
}
