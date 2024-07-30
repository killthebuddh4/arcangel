import { Field } from "../types/Field.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

const MAX_HEIGHT = 30;

export const validateHeight = (args: {
  field: Field;
  height: number;
}): Feedback<number> => {
  if (!Number.isInteger(args.height)) {
    return createFeedback({
      ok: false,
      code: "HEIGHT_IS_NOT_INTEGER",
      reason: `expected height to be an integer, but got ${args.height}`,
    });
  }

  if (args.height < 1) {
    return createFeedback({
      ok: false,
      code: "HEIGHT_IS_LESS_THAN_ONE",
      reason: `expected height to be greater than or equal to 1, but got ${args.height}`,
    });
  }

  if (args.height >= MAX_HEIGHT) {
    return createFeedback({
      ok: false,
      code: "HEIGHT_BIGGER_THAN_MAX",
      reason: `expected height to be less than the max height (${MAX_HEIGHT}), but got ${args.height}`,
    });
  }

  return createFeedback({ ok: true, data: args.height });
};
