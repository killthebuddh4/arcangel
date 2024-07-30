import { getRuntime } from "./getRuntime.js";
import { Feedback } from "./types/Feedback.js";
import { createFeedback } from "./createFeedback.js";
import { Transition } from "./types/Transition.js";

export const getState = (args: {
  transitionId: string;
}): Feedback<Transition> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "NO_RUNTIME_FOUND",
      reason: "No runtime found.",
    });
  }

  const transition = runtime.transitions.find((transition) => {
    return transition.id === args.transitionId;
  });

  if (transition === undefined) {
    return createFeedback({
      ok: false,
      code: "NO_TRANSITION_FOUND",
      reason: `No transition found with id: ${args.transitionId}`,
    });
  }
  return createFeedback({
    ok: true,
    data: transition,
  });
};
