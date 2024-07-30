import { getRuntime } from "./getRuntime.js";
import { Feedback } from "./types/Feedback.js";
import { Operator } from "./types/Operator.js";
import { createFeedback } from "./createFeedback.js";

export const getOperator = (args: {
  operatorId: string;
}): Feedback<Operator> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "NO_RUNTIME_FOUND",
      reason: "No runtime found.",
    });
  }

  const operator = runtime.operators.find((operator) => {
    return operator.id === args.operatorId;
  });

  if (operator === undefined) {
    return createFeedback({
      ok: false,
      code: "NO_OPERATOR_FOUND",
      reason: `No operator found with id: ${args.operatorId}`,
    });
  }

  return createFeedback({
    ok: true,
    data: operator,
  });
};
