import { getRuntime } from "./getRuntime.js";
import { Feedback } from "../types/Feedback.js";
import { Predicate } from "../types/Predicate.js";
import { createFeedback } from "./createFeedback.js";

export const getPredicates = (): Feedback<Predicate[]> => {
  const runtime = getRuntime();

  if (runtime === null) {
    return createFeedback({
      ok: false,
      code: "NO_RUNTIME_FOUND",
      reason: "No runtime found.",
    });
  }

  return createFeedback({
    ok: true,
    data: runtime.predicates,
  });
};
