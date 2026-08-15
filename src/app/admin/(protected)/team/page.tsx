import Link from "next/link";
import Image from "next/image";
import { Plus, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { TeamRowActions } from "./team-row-actions";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: members } = await supabase.from("team_members").select("*").order("display_order");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">টিম / আমাদের সম্পর্কে</h1>
          <p className="text-sm text-foreground/60">"আমাদের সম্পর্কে" পেজে দেখানো টিম মেম্বার যোগ ও পরিচালনা করুন</p>
        </div>
        <Link href="/admin/team/new">
          <Button>
            <Plus className="size-4" /> নতুন সদস্য
          </Button>
        </Link>
      </div>

      {!members || members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-foreground/60">
          <UserRound className="mx-auto mb-2 size-8 text-foreground/30" />
          এখনো কোনো টিম মেম্বার যোগ করা হয়নি।
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                  {m.photo_url ? (
                    <Image src={m.photo_url} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex size-full items-center justify-center text-foreground/30">
                      <UserRound className="size-6" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-foreground/50">{m.designation || "—"}</p>
                  <span className={m.is_active ? "text-xs text-primary-700" : "text-xs text-foreground/40"}>
                    {m.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </span>
                </div>
              </div>
              <TeamRowActions id={m.id} isActive={m.is_active} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
