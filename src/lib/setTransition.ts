import { getRuntime } from "./getRuntime.js";
import { Transition } from "../types/Transition.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const setTransition = (args: {
  transition: Transition;
}): Feedback<undefined> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "RUNTIME_NOT_FOUND",
      reason: "Runtime not found.",
    });
  }

  runtime.transitions.push(args.transition);

  return createFeedback({
    ok: true,
    data: undefined,
  });
};
