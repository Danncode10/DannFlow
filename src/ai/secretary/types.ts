import type { Tables } from "@/types/supabase";

export type SecretaryTask = Tables<"secretary_tasks">;

export interface ObservableState {
  id: string;
  table: string;
  trigger_field: string;
  trigger_condition: string;
  semantic_meaning: string;
  suggested_task: string;
  priority: "critical" | "high" | "medium" | "low";
  cooldown_hours?: number;
  requires_confirmation?: boolean;
}

export interface SchedulingIntent {
  intent: string;
  suggested_duration_minutes: number;
  priority: "critical" | "high" | "medium" | "low";
  requires_human_approval: boolean;
}

export interface AIManifest {
  manifest_version: string;
  vertical_id?: string;
  extends?: string;
  description?: string;
  observable_states: ObservableState[];
}
