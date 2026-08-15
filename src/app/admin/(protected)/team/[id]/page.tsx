import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "../team-form";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: member } = await supabase.from("team_members").select("*").eq("id", id).maybeSingle();

  if (!member) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">টিম সদস্য সম্পাদনা করুন</h1>
      </div>
      <TeamForm member={member} />
    </div>
  );
}
