/**
 * Custom error class for chatbot-specific errors.
 * Allows catching structured errors from the API vs generic network errors.
 */
export class ChatbotError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(
    message: string,
    {
      statusCode = 500,
      code = "CHATBOT_ERROR",
    }: { statusCode?: number; code?: string } = {},
  ) {
    super(message);
    this.name = "ChatbotError";
    this.statusCode = statusCode;
    this.code = code;
    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ChatbotError);
    }
  }
}
