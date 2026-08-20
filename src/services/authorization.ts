import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/types/supabase";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AuthenticatedUser = { user: User; profile: Profile };

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile?.is_active) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  return { user, profile };
}
