import { Field } from "./types/Field.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "./types/Feedback.js";

const MAX_WIDTH = 30;

export const parseWidth = (args: {
  field: Field;
  width: number;
}): Feedback<number> => {
  if (!Number.isInteger(args.width)) {
    return createFeedback({
      ok: false,
      code: "WIDTH_IS_NOT_INTEGER",
      reason: `expected width to be an integer, but got ${args.width}`,
    });
  }

  if (args.width < 1) {
    return createFeedback({
      ok: false,
      code: "WIDTH_IS_LESS_THAN_ONE",
      reason: `expected width to be greater than or equal to 1, but got ${args.width}`,
    });
  }

  if (args.width >= MAX_WIDTH) {
    return createFeedback({
      ok: false,
      code: "WIDTH_BIGGER_THAN_MAX",
      reason: `expected width to be less than the max width (${MAX_WIDTH}), but got ${args.width}`,
    });
  }

  return createFeedback({ ok: true, data: args.width });
};
