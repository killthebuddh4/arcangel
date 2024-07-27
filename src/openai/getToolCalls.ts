import { Feedback } from "../feedback/Feedback.js";
import type { ChatCompletion } from "openai/src/resources/index.js";
import { createFeedback } from "../feedback/createFeedback.js";

export const getToolCalls = (args: {
  completion: ChatCompletion;
}): Feedback<
  Array<{
    id: string;
    tool: string;
    args: unknown;
  }>
> => {
  const toolCalls = args.completion.choices[0].message.tool_calls;

  if (toolCalls === undefined) {
    return createFeedback({
      ok: false,
      reason: "No tool calls found in completion",
    });
  }

  const calls = [];

  for (const call of toolCalls) {
    const argString = call.function.arguments;

    let json;
    try {
      json = JSON.parse(argString);
    } catch (e) {
      return createFeedback({
        ok: false,
        reason: `A tool call had invalid JSON: ${argString}`,
      });
    }

    calls.push({
      id: call.id,
      tool: call.function.name,
      args: json,
    });
  }

  return createFeedback({
    ok: true,
    data: calls,
  });
};
