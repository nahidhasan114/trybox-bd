import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BrandForm } from "../brand-form";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase.from("brands").select("*").eq("id", id).maybeSingle();

  if (!brand) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ব্র্যান্ড সম্পাদনা করুন</h1>
      </div>
      <BrandForm brand={brand} />
    </div>
  );
}
