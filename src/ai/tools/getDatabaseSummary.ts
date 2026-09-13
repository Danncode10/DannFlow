import { tool } from "ai";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const getDatabaseSummary = tool({
  description:
    "Fetch high-level statistics and a summary of cases or records for the user.",
  inputSchema: z.object({
    topic: z
      .string()
      .describe(
        'The specific topic or area to summarize, e.g., "cases", "leads", "all"',
      ),
  }),
  execute: async ({ topic }: { topic: string }) => {
    try {
      const supabase = await createClient();
      let summaryText = "";

      if (topic.toLowerCase().includes("lead")) {
        const { count } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });
        summaryText = `You currently have ${count ?? 0} leads in the system.`;
      } else if (
        topic.toLowerCase().includes("book") ||
        topic.toLowerCase().includes("schedul")
      ) {
        const { count } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });
        summaryText = `You have ${count ?? 0} total bookings.`;
      } else {
        const { count: leadsCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });
        summaryText = `You currently have ${leadsCount ?? 0} leads and ${bookingsCount ?? 0} bookings.`;
      }

      return { summary: summaryText, status: "success" };
    } catch (e) {
      return { summary: "Failed to fetch data.", status: "error" };
    }
  },
});
