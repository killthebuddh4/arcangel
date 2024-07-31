import { ChatMessage } from "../types/ChatMessage.js";
import { createException } from "./createException.js";

export const getTokenEstimate = (args: { message: ChatMessage }): number => {
  const content = args.message.content;

  if (content === null) {
    return 0;
  }

  if (typeof content === "string") {
    return Math.ceil(content.length * 0.75);
  }

  let tokenCount = 0;
  for (const element of content) {
    if (element.type === "text") {
      tokenCount += Math.ceil(element.text.length * 0.75);
    }

    if (element.type === "image_url") {
      if (element.image_url.detail !== "low") {
        throw createException({
          code: "INVALID_IMAGE_DETAIL",
          reason: `Invalid image detail: ${element.image_url.detail}, expected "low".`,
        });
      }

      tokenCount += 85;
    }
  }

  return tokenCount;
};
