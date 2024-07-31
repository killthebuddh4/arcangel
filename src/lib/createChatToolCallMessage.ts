import { ChatToolCallMessage } from "../types/ChatToolCallMessage.js";
import { ChatToolCall } from "../types/ChatToolCall.js";

export const createChatToolCallMessage = (args: {
  content: string | null;
  toolCalls: ChatToolCall[];
}): ChatToolCallMessage => {
  return {
    role: "assistant",
    content: args.content,
    tool_calls: args.toolCalls,
  };
};
