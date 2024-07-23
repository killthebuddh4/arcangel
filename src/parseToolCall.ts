import { ParseResult } from "./ParseResult.js";
import type { ChatCompletion } from "openai/src/resources/index.js";

export const parseToolCall = (args: {
  completion: ChatCompletion;
}): ParseResult<unknown> => {
  const toolCalls = args.completion.choices[0].message.tool_calls;

  if (toolCalls === undefined) {
    return {
      ok: false,
      reason: "No tool calls found in completion",
    };
  }

  if (toolCalls.length !== 1) {
    return {
      ok: false,
      reason: `Expected exactly one tool call, but found ${toolCalls.length}`,
    };
  }

  const argString = toolCalls[0].function.arguments;

  let json;
  try {
    json = JSON.parse(argString);
  } catch (e) {
    return {
      ok: false,
      reason: `Invalid JSON: ${argString}`,
    };
  }

  return {
    ok: true,
    data: json,
  };
};
