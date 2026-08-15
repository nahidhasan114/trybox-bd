import { BannerForm } from "../banner-form";

export default function NewBannerPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন ব্যানার যোগ করুন</h1>
        <p className="text-sm text-foreground/60">হোমপেজে দেখানোর জন্য একটি ব্যানার তৈরি করুন</p>
      </div>
      <BannerForm />
    </div>
  );
}
