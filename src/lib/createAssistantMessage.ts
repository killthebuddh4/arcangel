import { AssistantMessage } from "../types/AssistantMessage.js";

export const createAssistantMessage = (args: {
  text: string;
}): AssistantMessage => {
  return {
    role: "assistant",
    content: args.text,
  };
};
