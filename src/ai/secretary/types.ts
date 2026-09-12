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

export interface SecretaryTask {
  id: string;
  user_id: string;
  vertical_id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  triggered_by_state_id: string;
  status: "pending" | "dismissed" | "done";
  created_at: string;
  updated_at: string;
}

export interface AIManifest {
  manifest_version: string;
  vertical_id?: string;
  extends?: string;
  description?: string;
  observable_states: ObservableState[];
}
