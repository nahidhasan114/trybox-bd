import { getShippingTiers } from "@/lib/queries/shipping";
import { ShippingSettingsForm } from "./shipping-settings-form";

export default async function AdminShippingPage() {
  const tiers = await getShippingTiers();

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">শিপিং / ডেলিভারি চার্জ</h1>
        <p className="text-sm text-foreground/60">
          কার্টের মোট ওজনের উপর ভিত্তি করে ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে হিসাব হয়। এখান থেকে রেট পরিবর্তন করুন।
        </p>
      </div>
      <ShippingSettingsForm tiers={tiers} />
    </div>
  );
}
