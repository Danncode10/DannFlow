export type ModelCapabilities = {
  vision?: boolean;
  tools?: boolean;
  reasoning?: boolean;
};

export type ChatModel = {
  id: string;
  name: string;
  provider?: string;
  capabilities?: ModelCapabilities;
};

export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

export const chatModels: ChatModel[] = [
  { id: "gpt-4o-mini", name: "GPT 4o Mini", provider: "openai" },
];
