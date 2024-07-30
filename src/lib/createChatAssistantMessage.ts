import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { ChatAssistantMessage } from "../types/ChatAssistantMessage.js";

export const createChatAssistantMessage = (args: {
  content: string;
}): Maybe<ChatAssistantMessage> => {
  return createMaybe({
    ok: true,
    data: {
      role: "assistant",
      content: args.content,
    },
  });
};
