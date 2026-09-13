import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type SecretaryTask = Database["public"]["Tables"]["secretary_tasks"]["Row"];

export async function getOpenTasks(
  supabase: SupabaseClient<Database>,
): Promise<SecretaryTask[]> {
  const { data, error } = await supabase
    .from("secretary_tasks")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function dismissTask(
  supabase: SupabaseClient<Database>,
  taskId: string,
): Promise<void> {
  const { error } = await supabase
    .from("secretary_tasks")
    .update({ status: "dismissed" })
    .eq("id", taskId);

  if (error) {
    console.error("Error dismissing task:", error);
    throw new Error(error.message);
  }
}

export async function completeTask(
  supabase: SupabaseClient<Database>,
  taskId: string,
): Promise<void> {
  const { error } = await supabase
    .from("secretary_tasks")
    .update({ status: "done" })
    .eq("id", taskId);

  if (error) {
    console.error("Error completing task:", error);
    throw new Error(error.message);
  }
}
