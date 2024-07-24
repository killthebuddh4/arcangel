import { Maybe } from "../Maybe.js";
import type { ChatCompletion } from "openai/src/resources/index.js";

export const parseToolCalls = (args: {
  completion: ChatCompletion;
}): Maybe<
  Array<{
    id: string;
    tool: string;
    args: unknown;
  }>
> => {
  const toolCalls = args.completion.choices[0].message.tool_calls;

  if (toolCalls === undefined) {
    return {
      ok: false,
      reason: "No tool calls found in completion",
    };
  }

  const calls = [];

  for (const call of toolCalls) {
    const argString = call.function.arguments;

    let json;
    try {
      json = JSON.parse(argString);
    } catch (e) {
      return {
        ok: false,
        reason: `A tool call had invalid JSON: ${argString}`,
      };
    }

    calls.push({
      id: call.id,
      tool: call.function.name,
      args: json,
    });
  }

  return {
    ok: true,
    data: calls,
  };
};
