# AI Tools Architecture

The JuanStack Conversational AI Secretary uses a modular, manifest-driven tool calling architecture powered by the Vercel AI SDK and Supabase. This architecture ensures that different SaaS verticals can expose different AI capabilities dynamically without needing to hardcode large conditionals in the main API route.

## 1. Tool Manifest (`src/ai/tools.ai-manifest.json`)

The manifest acts as the source of truth for which tools are enabled for the current vertical.

```json
{
  "version": "1.0",
  "tools": [
    {
      "id": "getDatabaseSummary",
      "description": "Fetch high-level statistics...",
      "enabled": true
    }
  ]
}
```

The API route (`src/app/api/chat/route.ts`) reads this JSON file at request time and filters out any disabled tools.

## 2. Tool Implementations (`src/ai/tools/`)

Instead of keeping tool logic inline in the API route, all tools are extracted into their own isolated files within the `src/ai/tools/` directory.

- Each tool must export a Vercel AI `tool()` definition.
- Each tool defines its own Zod `inputSchema` and `execute` function.
- The `execute` function runs on the server and should use `@/utils/supabase/server` to fetch or mutate tenant-isolated data.

## 3. Tool Registry (`src/ai/tools/index.ts`)

The `index.ts` file acts as the barrel and registry. All tools must be added to the `aiToolsRegistry` record so the API route can look them up by their `id` defined in the manifest.

```typescript
import { getDatabaseSummary } from "./getDatabaseSummary";
import { createSchedule } from "./createSchedule";

export const aiToolsRegistry: Record<string, any> = {
  getDatabaseSummary,
  createSchedule,
};
```

## Adding a New Tool for a Vertical

1. **Define the tool:** Create `src/ai/tools/myNewTool.ts`. Write your Zod schema and execution logic. Make sure it respects RLS!
2. **Register it:** Add it to the `aiToolsRegistry` in `src/ai/tools/index.ts`.
3. **Enable it:** Add its `id` to the `tools.ai-manifest.json` and set `"enabled": true`.

When the chat API runs, it will dynamically map your new tool into the `streamText` function!
