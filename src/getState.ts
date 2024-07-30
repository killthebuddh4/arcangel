import { getRuntime } from "./getRuntime.js";
import { Feedback } from "./types/Feedback.js";
import { createFeedback } from "./createFeedback.js";
import { State } from "./types/State.js";

export const getState = (args: { stateId: string }): Feedback<State> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "NO_RUNTIME_FOUND",
      reason: "No runtime found.",
    });
  }

  const state = runtime.states.find((state) => {
    return state.id === args.stateId;
  });

  if (state === undefined) {
    return createFeedback({
      ok: false,
      code: "NO_STATE_FOUND",
      reason: `No state found with id: ${args.stateId}`,
    });
  }
  return createFeedback({
    ok: true,
    data: state,
  });
};
