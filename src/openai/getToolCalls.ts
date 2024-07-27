import { Feedback } from "../feedback/Feedback.js";
import type { ChatCompletion } from "openai/src/resources/index.js";
import { createFeedback } from "../feedback/createFeedback.js";

type GetToolCallsFeedbackCode = "NO_TOOL_CALLS";

export const getToolCalls = (args: {
  completion: ChatCompletion;
}): Feedback<
  Array<{
    id: string;
    tool: string;
    args: string;
  }>,
  GetToolCallsFeedbackCode
> => {
  const toolCalls = args.completion.choices[0].message.tool_calls;

  if (toolCalls === undefined) {
    return createFeedback({
      ok: false,
      code: "NO_TOOL_CALLS",
      reason: "No tool calls found in completion",
    });
  }

  const calls = [];

  for (const call of toolCalls) {
    calls.push({
      id: call.id,
      tool: call.function.name,
      args: call.function.arguments,
    });
  }

  return createFeedback({
    ok: true,
    data: calls,
  });
};
