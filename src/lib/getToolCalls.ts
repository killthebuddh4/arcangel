import { ChatToolCall } from "../types/ChatToolCall.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import type { ChatCompletion } from "openai/src/resources/index.js";

export const getToolCalls = (args: {
  completion: ChatCompletion;
}): Maybe<ChatToolCall[]> => {
  const toolCalls = args.completion.choices[0].message.tool_calls;

  if (toolCalls === undefined) {
    return createMaybe({
      ok: false,
      code: "NO_TOOL_CALLS",
      reason: "No tool calls found in completion",
    });
  }

  const calls: ChatToolCall[] = [];

  for (const call of toolCalls) {
    calls.push({
      id: call.id,
      tool: call.function.name,
      args: call.function.arguments,
    });
  }

  return createMaybe({
    ok: true,
    data: calls,
  });
};
