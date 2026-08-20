"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import type { Json, Tables } from "@/types/supabase";

type TeamRole = "admin" | "user";
type Profile = Tables<"profiles">;

export type TeamMember = Pick<Profile, "id" | "email" | "full_name" | "role" | "created_at" | "is_active">;
export type TeamActionResult = { error?: string; success?: string };

function parseTeamRole(value: string): TeamRole | null {
  return value === "admin" || value === "user" ? value : null;
}

async function getAdminActor() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to manage the team.");

  const { data: profile } = await supabase.from("profiles").select("id, role, is_active").eq("id", user.id).single();
  if (!profile || profile.role !== "admin" || !profile.is_active) throw new Error("Only active administrators can manage the team.");
  return profile;
}

async function assertNotFinalActiveAdmin(target: TeamMember, nextRole: TeamRole, nextIsActive: boolean) {
  if (target.role !== "admin" || !target.is_active || (nextRole === "admin" && nextIsActive)) return;
  const adminClient = createAdminClient();
  const { count, error } = await adminClient.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin").eq("is_active", true);
  if (error) throw new Error("Could not verify the active administrator count.");
  if ((count ?? 0) <= 1) throw new Error("The final active administrator cannot be deactivated or moved to another role.");
}

async function writeAuditLog(actorId: string, targetId: string, action: string, previousValues: Record<string, string | boolean | null>, nextValues: Record<string, string | boolean | null>) {
  const { error } = await createAdminClient().from("team_audit_logs").insert({ actor_id: actorId, target_profile_id: targetId, action, previous_values: previousValues as Json, next_values: nextValues as Json });
  if (error) throw new Error("The team change could not be recorded for audit.");
}

export async function listTeam(): Promise<TeamMember[]> {
  await getAdminActor();
  const { data, error } = await createAdminClient().from("profiles").select("id, email, full_name, role, created_at, is_active").order("created_at", { ascending: true });
  if (error) throw new Error("Could not load team members.");
  return data;
}

export async function addExistingTeamMember(input: { email: string; role: string }): Promise<TeamActionResult> {
  try {
    const actor = await getAdminActor();
    const email = input.email.trim().toLowerCase();
    const role = parseTeamRole(input.role);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid team-member email address." };
    if (!role) return { error: "Choose a valid team role." };
    const adminClient = createAdminClient();
    const { data: target } = await adminClient.from("profiles").select("id, email, full_name, role, created_at, is_active").eq("email", email).maybeSingle();
    if (!target) return { error: "No account found for this email. Ask the person to create an account first." };
    await assertNotFinalActiveAdmin(target, role, true);
    const { error } = await adminClient.from("profiles").update({ role, is_active: true }).eq("id", target.id);
    if (error) return { error: "Could not add this account to the team." };
    await writeAuditLog(actor.id, target.id, target.role === "user" ? "team_added" : "team_updated", { role: target.role, is_active: target.is_active }, { role, is_active: true });
    revalidatePath("/dashboard/team");
    return { success: `${email} is now ${role === "admin" ? "an administrator" : "a team member"}.` };
  } catch (error) { return { error: error instanceof Error ? error.message : "Could not add a team member." }; }
}

export async function updateTeamRole(input: { id: string; role: string }): Promise<TeamActionResult> {
  try {
    const actor = await getAdminActor();
    const role = parseTeamRole(input.role);
    if (!input.id || !role) return { error: "Choose a valid team role." };
    const adminClient = createAdminClient();
    const { data: target } = await adminClient.from("profiles").select("id, email, full_name, role, created_at, is_active").eq("id", input.id).single();
    if (!target) return { error: "That team account is not available." };
    await assertNotFinalActiveAdmin(target, role, target.is_active);
    const { error } = await adminClient.from("profiles").update({ role }).eq("id", target.id);
    if (error) return { error: "Could not update the team role." };
    await writeAuditLog(actor.id, target.id, "team_updated", { role: target.role, is_active: target.is_active }, { role, is_active: target.is_active });
    revalidatePath("/dashboard/team");
    return { success: "Team role updated." };
  } catch (error) { return { error: error instanceof Error ? error.message : "Could not update the team role." }; }
}

export async function setTeamActive(input: { id: string; isActive: boolean }): Promise<TeamActionResult> {
  try {
    const actor = await getAdminActor();
    const adminClient = createAdminClient();
    const { data: target } = await adminClient.from("profiles").select("id, email, full_name, role, created_at, is_active").eq("id", input.id).single();
    if (!target) return { error: "That team account is not available." };
    await assertNotFinalActiveAdmin(target, target.role as TeamRole, input.isActive);
    const { error } = await adminClient.from("profiles").update({ is_active: input.isActive }).eq("id", target.id);
    if (error) return { error: "Could not update the team account status." };
    const { error: authError } = await adminClient.auth.admin.updateUserById(target.id, { ban_duration: input.isActive ? "none" : "876000h" });
    if (authError) { await adminClient.from("profiles").update({ is_active: target.is_active }).eq("id", target.id); return { error: "Could not update sign-in access for this account." }; }
    await writeAuditLog(actor.id, target.id, input.isActive ? "team_reactivated" : "team_deactivated", { is_active: target.is_active }, { is_active: input.isActive });
    revalidatePath("/dashboard/team");
    return { success: input.isActive ? "Team account reactivated." : "Team account deactivated." };
  } catch (error) { return { error: error instanceof Error ? error.message : "Could not update the team account status." }; }
}
