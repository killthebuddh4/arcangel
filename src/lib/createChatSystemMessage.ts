import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { ChatSystemMessage } from "../types/ChatSystemMessage.js";

export const createChatSystemMessage = (args: {
  content: string;
}): Maybe<ChatSystemMessage> => {
  return createMaybe({
    ok: true,
    data: {
      role: "system",
      content: args.content,
    },
  });
};
