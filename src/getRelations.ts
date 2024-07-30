import { getRuntime } from "./getRuntime.js";
import { Feedback } from "./types/Feedback.js";
import { Relation } from "./types/Relation.js";
import { createFeedback } from "./createFeedback.js";

export const getRelations = (): Feedback<Relation[]> => {
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
    data: runtime.relations,
  });
};
