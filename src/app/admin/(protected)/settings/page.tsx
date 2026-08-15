import { getSiteSettings } from "@/lib/site-settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">সাইট সেটিংস</h1>
        <p className="text-sm text-foreground/60">
          লোগো, ফোন নম্বর, bKash/Nagad নম্বর, ডেলিভারি চার্জ সহ সব কিছু এখান থেকে পরিবর্তন করতে পারবেন।
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
