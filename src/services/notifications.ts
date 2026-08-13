"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function listNotifications(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getUnreadCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
  if (error) return 0;
  return count ?? 0;
}

export async function markAsRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard");
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
  if (error) throw error;
  revalidatePath("/dashboard");
}
