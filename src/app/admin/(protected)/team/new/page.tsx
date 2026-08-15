import { TeamForm } from "../team-form";

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">নতুন টিম সদস্য যোগ করুন</h1>
      </div>
      <TeamForm />
    </div>
  );
}
