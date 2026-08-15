import { getSiteSettings } from "@/lib/site-settings";
import { CheckoutForm } from "./checkout-form";

export const metadata = { title: "চেকআউট" };

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="mb-5 text-xl font-semibold text-foreground">চেকআউট</h1>
      <CheckoutForm
        bkashNumber={settings.bkash_number?.number ?? ""}
        nagadNumber={settings.nagad_number?.number ?? ""}
      />
    </div>
  );
}
