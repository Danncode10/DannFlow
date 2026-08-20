import { requireAdmin } from "@/services/authorization";
import { listTeam } from "@/services/team";
import { TeamManagement } from "@/components/team-management";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function TeamPage() {
  const { user, profile } = await requireAdmin();
  const members = await listTeam();
  return (
    <DashboardShell user={user} profile={profile}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Team management</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add accounts, update roles, and deactivate team members.</p>
        </div>
        <TeamManagement members={members} />
      </div>
    </DashboardShell>
  );
}
