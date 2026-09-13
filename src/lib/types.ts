import type { UIMessage } from "ai";

export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

export type ChatMessage = UIMessage & {
  parts?: any[];
};

export type Attachment = {
  url: string;
  contentType: string;
  name: string;
};

export type WaitingStatusData = {
  status?: string;
  message?: string;
};

export type CustomUIDataTypes = {
  waitingStatus?: WaitingStatusData;
  [key: string]: unknown;
};
