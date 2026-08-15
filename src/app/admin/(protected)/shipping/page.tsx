import { createClient } from "@/lib/supabase/server";
import { ShippingRuleRow } from "./shipping-rule-row";

export default async function AdminShippingPage() {
  const supabase = await createClient();
  const { data: rules } = await supabase.from("shipping_rules").select("*").order("display_order");

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">শিপিং রুলস</h1>
        <p className="text-sm text-foreground/60">এলাকা অনুযায়ী ডেলিভারি চার্জ নির্ধারণ করুন</p>
      </div>
      <div className="space-y-4">
        {(rules ?? []).map((rule) => (
          <ShippingRuleRow key={rule.id} rule={rule} />
        ))}
      </div>
    </div>
  );
}
