import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import {
  evaluateState,
  createTask,
  AIManifest,
} from "../_shared/task-engine.ts";
import coreManifestRaw from "../_shared/core.ai-manifest.json" with { type: "json" };

const coreManifest = coreManifestRaw as unknown as AIManifest;

serve(async () => {
  try {
    // 1. Initialize Supabase Admin Client to bypass RLS for background scanning
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("AI Secretary: Starting scan...");

    let newTasksCount = 0;

    // 2. Iterate through core observable states
    for (const state of coreManifest.observable_states) {
      console.log(`Scanning table: ${state.table} for state: ${state.id}`);

      // Fetch all rows from the target table.
      // In a real production system, this should be paginated or strictly filtered by updated_at or status.
      const { data: rows, error } = await supabase
        .from(state.table)
        .select("*");

      if (error) {
        console.error(`Error fetching from ${state.table}:`, error.message);
        continue;
      }

      for (const row of rows || []) {
        if (evaluateState(state, row)) {
          // Condition met! Create a task payload.
          // Note: organization_id is determined differently depending on the table.
          // For JuanStack generic tables, we assume the row either HAS organization_id or owner_id.
          const orgId = row.organization_id || row.id;

          const taskPayload = {
            ...createTask(state, orgId, row.id),
            organization_id: orgId,
          };

          // 3. Insert the task, but avoid duplicates if the task is already pending
          const { data: existing } = await supabase
            .from("secretary_tasks")
            .select("id")
            .eq("organization_id", orgId)
            .eq("triggered_by_state_id", state.id)
            .eq("status", "pending")
            .single();

          if (!existing) {
            const { error: insertError } = await supabase
              .from("secretary_tasks")
              .insert(taskPayload);
            if (insertError) {
              console.error("Failed to insert task:", insertError.message);
            } else {
              newTasksCount++;
              console.log(`Task created for org ${orgId} -> ${state.id}`);
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Scan complete", newTasksCount }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    console.error("Critical error in AI Secretary:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
