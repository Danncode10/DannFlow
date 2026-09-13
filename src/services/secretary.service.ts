"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getOpenTasks,
  dismissTask,
  completeTask,
} from "@/ai/secretary/task-queue";

export async function fetchSecretaryTasks() {
  const supabase = await createClient();
  return await getOpenTasks(supabase);
}

export async function markTaskDismissed(taskId: string) {
  const supabase = await createClient();
  await dismissTask(supabase, taskId);
  revalidatePath("/dashboard");
}

export async function markTaskDone(taskId: string) {
  const supabase = await createClient();
  await completeTask(supabase, taskId);
  revalidatePath("/dashboard");
}
