import { openai } from "@ai-sdk/openai";
import { streamText, tool, isStepCount, convertToModelMessages } from "ai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { createClient } from "@/utils/supabase/server";
import { aiToolsRegistry } from "@/ai/tools";
import {
  createOrGetChat,
  saveChatMessage,
  updateChatTitle,
} from "@/services/ai-chat.service";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("API/CHAT RECEIVED BODY:", JSON.stringify(body));
    const messages = Array.isArray(body) ? body : body.messages;
    console.log("API/CHAT PARSED MESSAGES:", JSON.stringify(messages));

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages payload", { status: 400 });
    }

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

    for (const toolId of enabledToolIds) {
      if (aiToolsRegistry[toolId]) {
        activeTools[toolId] = aiToolsRegistry[toolId];
      } else {
        console.warn(
          `Tool ${toolId} is enabled in manifest but not found in registry.`,
        );
      }
    }

    const chatId = body.id || "secretary-chat";
    const modelMessages = await convertToModelMessages(messages);

    // Save the user's latest message to the database
    const userMessage = messages.filter((m: any) => m.role === "user").pop();
    if (userMessage) {
      const parts = userMessage.parts || [
        { type: "text", text: userMessage.content || "" },
      ];
      const textContent = parts.find((p: any) => p.type === "text")?.text || "";
      const isFirstMessage =
        messages.filter((m: any) => m.role === "user").length === 1;
      const title =
        isFirstMessage && textContent
          ? textContent.slice(0, 35) + (textContent.length > 35 ? "..." : "")
          : undefined;

      try {
        await createOrGetChat(chatId, title || "New Conversation");
        if (title) {
          await updateChatTitle(chatId, title);
        }
        await saveChatMessage(chatId, "user", parts);
      } catch (err) {
        console.error("Error saving user message:", err);
      }
    }

    const result = streamText({
      model: openai("gpt-4o-mini"), // Assuming gpt-4o-mini as a fast default
      system: `You are a helpful AI Secretary embedded in the user's dashboard. 
You can help them summarize their data or schedule meetings using your tools.
Be concise, professional, and friendly.`,
      messages: modelMessages,
      tools: activeTools,
      stopWhen: isStepCount(5), // Allow multi-step tool calls up to 5 steps
      onFinish: async (event) => {
        try {
          if (event.text) {
            await saveChatMessage(chatId, "assistant", [
              { type: "text", text: event.text },
            ]);
          }
        } catch (saveErr) {
          console.error("Error saving assistant message:", saveErr);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
