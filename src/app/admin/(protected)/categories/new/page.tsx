import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "../category-form";

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_bn")
    .order("display_order");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন ক্যাটাগরি যোগ করুন</h1>
      </div>
      <CategoryForm
        parentOptions={(categories ?? []).map((c) => ({ value: c.id, label: c.name_bn }))}
      />
    </div>
  );
}
