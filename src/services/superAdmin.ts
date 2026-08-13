"use server";

import { createAdminClient, createClient } from "@/utils/supabase/server";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Tables } from "@/types/supabase";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? "business-template";

export type SuperAdminProfile = Pick<
  Tables<"profiles">,
  "id" | "email" | "full_name" | "role" | "created_at" | "app_id"
>;

export type SuperAdminSession = {
  user: SupabaseUser;
  profile: Tables<"profiles"> | null;
};

function configuredSuperAdminEmails() {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isConfiguredSuperAdmin(email: string | null | undefined) {
  const emails = configuredSuperAdminEmails();
  if (!email || emails.length === 0) return false;
  return emails.includes(email.toLowerCase());
}

function isAdminProfile(profile: Tables<"profiles"> | null) {
  return profile?.role === "admin" && profile.app_id === APP_ID;
}

export async function getSuperAdminSession(): Promise<SuperAdminSession | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("app_id", APP_ID)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  if (!isConfiguredSuperAdmin(user.email) && !isAdminProfile(profile)) {
    return null;
  }

  return { user, profile };
}

export async function requireSuperAdmin() {
  const session = await getSuperAdminSession();
  if (!session) throw new Error("Super admin access required");
  return session;
}

export async function listSuperAdminUsers(): Promise<SuperAdminProfile[]> {
  await requireSuperAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, app_id")
    .eq("app_id", APP_ID)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
