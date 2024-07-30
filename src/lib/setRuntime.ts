import { Runtime } from "../types/Runtime.js";
import { getStore } from "./getStore.js";
import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const setRuntime = (args: { runtime: Runtime }): Feedback<undefined> => {
  const store = getStore();

  if (store.runtime !== null) {
    return createFeedback({
      ok: false,
      code: "RUNTIME_ALREADY_SET",
      reason: "Runtime already set.",
    });
  }

  store.runtime = args.runtime;

  return createFeedback({
    ok: true,
    data: undefined,
  });
};
