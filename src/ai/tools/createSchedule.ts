import { tool } from "ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const createSchedule = tool({
  description: "Create a new meeting or schedule in the calendar.",
  inputSchema: z.object({
    title: z.string().describe("The title of the meeting"),
    time: z
      .string()
      .describe(
        "The time of the meeting in ISO format or descriptive date like 'Tomorrow at 3PM'",
      ),
  }),
  execute: async ({ title, time }: { title: string; time: string }) => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { message: "Unauthorized", status: "error" };

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
      if (!profile?.organization_id)
        return { message: "No organization found.", status: "error" };

      const startTime = new Date(time);
      if (isNaN(startTime.getTime())) {
        return { message: "Invalid time format provided.", status: "error" };
      }
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const { error } = await supabase.from("calendar_events").insert({
        organization_id: profile.organization_id,
        title,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
      });
      if (error) throw error;

      return {
        message: `Successfully booked "${title}" for ${startTime.toLocaleString()}.`,
        status: "success",
      };
    } catch (e: unknown) {
      return {
        message: `Failed to create schedule: ${e instanceof Error ? e.message : "Unknown error"}`,
        status: "error",
      };
    }
  },
});
