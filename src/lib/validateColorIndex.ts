import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

export const validateColorIndex = (args: {
  index: number;
}): Feedback<number> => {
  if (!Number.isInteger(args.index)) {
    return createFeedback({
      ok: false,
      code: "COLOR_INDEX_NOT_INTEGER",
      reason: `Color index must be an integer, but got ${args.index}.`,
    });
  }

  if (args.index < 0 || args.index > 9) {
    return createFeedback({
      ok: false,
      code: "COLOR_INDEX_OUT_OF_RANGE",
      reason: `Color index must be between 0 and 9, but got ${args.index}.`,
    });
  }

  return createFeedback({
    ok: true,
    data: args.index,
  });
};
