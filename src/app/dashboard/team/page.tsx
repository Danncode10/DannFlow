import { requireAdmin } from "@/services/authorization";
import { listTeam } from "@/services/team";
import { TeamManagement } from "@/components/team-management";

export default async function TeamPage() {
  await requireAdmin();
  const members = await listTeam();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Team management</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add accounts, update roles, and deactivate team members.</p>
      </div>
      <TeamManagement members={members} />
    </div>
  );
}
