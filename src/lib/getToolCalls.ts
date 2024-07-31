import { ChatToolCall } from "../types/ChatToolCall.js";
import type { ChatCompletion } from "openai/src/resources/index.js";

export const getToolCalls = (args: {
  completion: ChatCompletion;
}): ChatToolCall[] | undefined => {
  return args.completion.choices[0].message.tool_calls;
};
