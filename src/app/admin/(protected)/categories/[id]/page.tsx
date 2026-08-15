import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "../category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: category }, { data: categories }] = await Promise.all([
    supabase.from("categories").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name_bn").neq("id", id).order("display_order"),
  ]);

  if (!category) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">ক্যাটাগরি সম্পাদনা করুন</h1>
      </div>
      <CategoryForm
        category={category}
        parentOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
      />
    </div>
  );
}
