import { BrandForm } from "../brand-form";

export default function NewBrandPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন ব্র্যান্ড যোগ করুন</h1>
      </div>
      <BrandForm />
    </div>
  );
}
