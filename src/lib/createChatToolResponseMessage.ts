import { ChatToolResponseMessage } from "../types/ChatToolResponseMessage.js";

export const createChatToolResponseMessage = (args: {
  toolCallId: string;
  name: string;
  content: string;
}): ChatToolResponseMessage => {
  return {
    role: "tool",
    name: args.name,
    tool_call_id: args.toolCallId,
    content: args.content,
  };
};
