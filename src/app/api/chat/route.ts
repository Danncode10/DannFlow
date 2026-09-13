import { openai } from "@ai-sdk/openai";
import { streamText, tool, isStepCount } from "ai";
import { z } from "zod";
import fs from "fs";
import path from "path";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Read the tool manifest to see what's enabled
    const manifestPath = path.join(
      process.cwd(),
      "src/ai/tools.ai-manifest.json",
    );
    let enabledToolIds: string[] = [];

    if (fs.existsSync(manifestPath)) {
      const manifestFile = fs.readFileSync(manifestPath, "utf-8");
      const manifest = JSON.parse(manifestFile);
      enabledToolIds = manifest.tools
        .filter((t: { enabled: boolean; id: string }) => t.enabled)
        .map((t: { enabled: boolean; id: string }) => t.id);
    }

    // Build the available tools dynamically based on the manifest
    const activeTools: Record<string, any> = {};

    if (enabledToolIds.includes("getDatabaseSummary")) {
      activeTools.getDatabaseSummary = tool({
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
          // TODO: Phase 4/5 - Connect to real Supabase database securely
          return {
            summary: `Mock summary for ${topic}: You currently have 5 active records and 2 pending tasks.`,
            status: "success",
          };
        },
      });
    }

    if (enabledToolIds.includes("createSchedule")) {
      activeTools.createSchedule = tool({
        description: "Create a new meeting or schedule in the calendar.",
        inputSchema: z.object({
          title: z.string().describe("The title of the meeting"),
          time: z.string().describe("The time of the meeting"),
        }),
        execute: async ({ title, time }: { title: string; time: string }) => {
          // TODO: Phase 4 - Connect to scheduling core engine
          return {
            message: `Successfully booked "${title}" for ${time}.`,
            status: "success",
          };
        },
      });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"), // Assuming gpt-4o-mini as a fast default
      system: `You are a helpful AI Secretary embedded in the user's dashboard. 
You can help them summarize their data or schedule meetings using your tools.
Be concise, professional, and friendly.`,
      messages,
      tools: activeTools,
      stopWhen: isStepCount(5), // Allow multi-step tool calls up to 5 steps
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
