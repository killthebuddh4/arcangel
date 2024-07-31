import { ChatSystemMessage } from "../types/ChatSystemMessage.js";

export const createChatSystemMessage = (args: {
  content: string;
}): ChatSystemMessage => {
  return {
    role: "system",
    content: args.content,
  };
};
