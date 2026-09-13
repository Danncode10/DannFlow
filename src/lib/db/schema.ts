export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

export type Document = {
  id: string;
  title: string;
  kind: "text" | "code" | "image" | "sheet";
  content: string | null;
  userId: string;
  createdAt: Date;
};
