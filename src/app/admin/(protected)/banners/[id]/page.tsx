import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "../banner-form";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: banner } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();

  if (!banner) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ব্যানার সম্পাদনা করুন</h1>
      </div>
      <BannerForm banner={banner} />
    </div>
  );
}
