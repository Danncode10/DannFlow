"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { TablesInsert } from "@/types/supabase";

export async function listLeads(statusFilter?: string) {
  const supabase = await createClient();
  let q = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "all") q = q.eq("status", statusFilter);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function createLead(input: TablesInsert<"leads">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert(input)
    .select()
    .single();
  if (error) throw error;

  // Fire a notification
  await supabase.from("notifications").insert({
    type: "new_lead",
    title: "New lead",
    body: `${input.name} (${input.email})`,
    link: "/dashboard?tab=leads",
  });

  return data;
}

export async function updateLeadStatus(id: string, status: string, notes?: string) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (notes !== undefined) updates.notes = notes;
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard");
}
