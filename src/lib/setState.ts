import { getRuntime } from "./getRuntime.js";
import { State } from "../types/State.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const setState = (args: { state: State }): Feedback<undefined> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "RUNTIME_NOT_FOUND",
      reason: "Runtime not found.",
    });
  }

  runtime.states.push(args.state);

  return createFeedback({
    ok: true,
    data: undefined,
  });
};
