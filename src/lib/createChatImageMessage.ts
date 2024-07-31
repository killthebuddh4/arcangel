import { ChatImageMessage } from "../types/ChatImageMessage.js";

export const createChatImageMessage = (args: {
  text: string;
  dataUrl: string;
}): ChatImageMessage => {
  return {
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
  };
};
