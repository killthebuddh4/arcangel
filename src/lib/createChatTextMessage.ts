import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { ChatTextMessage } from "../types/ChatTextMessage.js";

export const createChatTextMessage = (args: {
  content: string;
}): Maybe<ChatTextMessage> => {
  return createMaybe({
    ok: true,
    data: {
      role: "user",
      content: args.content,
    },
  });
};
