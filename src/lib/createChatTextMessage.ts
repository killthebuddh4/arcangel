import { ChatTextMessage } from "../types/ChatTextMessage.js";

export const createChatTextMessage = (args: {
  content: string;
}): ChatTextMessage => {
  return {
    role: "user",
    content: args.content,
  };
};
