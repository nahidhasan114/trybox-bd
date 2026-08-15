import { getSiteSettings } from "@/lib/site-settings";
import { OrderConfirmationClient } from "./order-confirmation-client";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const settings = await getSiteSettings();

  return <OrderConfirmationClient orderNumber={orderNumber} codTrustMessage={settings.cod_trust_message} />;
}
