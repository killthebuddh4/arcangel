import { getRuntime } from "./getRuntime.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";
import { State } from "../types/State.js";

export const getHeads = (): Feedback<State[]> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "RUNTIME_NOT_FOUND",
      reason: "Runtime not found.",
    });
  }

  return createFeedback({
    ok: true,
    data: runtime.states.filter((state) => {
      return runtime.transitions.every((transition) => {
        return transition.upstream.id !== state.id;
      });
    }),
  });
};
