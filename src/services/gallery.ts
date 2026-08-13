"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";

export async function listGalleryItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createGalleryItem(input: TablesInsert<"gallery_items">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function updateGalleryItem(id: string, updates: TablesUpdate<"gallery_items">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/dashboard");
}
