import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { ChatToolResponseMessage } from "../types/ChatToolResponseMessage.js";

export const createChatToolResponseMessage = (args: {
  toolCallId: string;
  name: string;
  content: string;
}): Maybe<ChatToolResponseMessage> => {
  return createMaybe({
    ok: true,
    data: {
      role: "tool",
      name: args.name,
      tool_call_id: args.toolCallId,
      content: args.content,
    },
  });
};
