import { getSiteSettings } from "@/lib/site-settings";
import { createClient } from "@/lib/supabase/server";
import { OrderConfirmationClient } from "./order-confirmation-client";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const supabase = await createClient();
  const [settings, { data: { user } }] = await Promise.all([getSiteSettings(), supabase.auth.getUser()]);

  return (
    <OrderConfirmationClient
      orderNumber={orderNumber}
      codTrustMessage={settings.cod_trust_message}
      isLoggedIn={!!user}
    />
  );
}
