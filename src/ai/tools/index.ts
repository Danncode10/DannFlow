import { getDatabaseSummary } from "./getDatabaseSummary";
import { createSchedule } from "./createSchedule";

// Registry of all available tools
export const aiToolsRegistry: Record<string, unknown> = {
  getDatabaseSummary,
  createSchedule,
};
