import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { ChatImageMessage } from "../types/ChatImageMessage.js";

export const createChatImageMessage = (args: {
  text: string;
  dataUrl: string;
}): Maybe<ChatImageMessage> => {
  return createMaybe({
    ok: true,
    data: {
      role: "user",
      content: [
        {
          type: "text",
          text: args.text,
        },
        {
          type: "image_url",
          image_url: { url: args.dataUrl },
        },
      ],
    },
  });
};
