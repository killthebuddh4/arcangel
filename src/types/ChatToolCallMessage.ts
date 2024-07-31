import { ChatToolCall } from "../types/ChatToolCall.js";

export type ChatToolCallMessage = {
  role: "assistant";
  content: string | null;
  tool_calls: ChatToolCall[];
};
