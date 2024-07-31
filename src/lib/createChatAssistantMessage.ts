import { ChatAssistantMessage } from "../types/ChatAssistantMessage.js";

export const createChatAssistantMessage = (args: {
  content: string;
}): ChatAssistantMessage => {
  return {
    role: "assistant",
    content: args.content,
  };
};
