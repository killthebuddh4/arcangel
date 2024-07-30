import { Field } from "./types/Field.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "./types/Feedback.js";

export const validateX = (args: {
  field: Field;
  x: number;
}): Feedback<number> => {
  if (!Number.isInteger(args.x)) {
    return createFeedback({
      ok: false,
      code: "X_IS_NOT_INTEGER",
      reason: `expected x to be an integer, but got ${args.x}`,
    });
  }

  if (args.x < 0) {
    return createFeedback({
      ok: false,
      code: "X_IS_NEGATIVE",
      reason: `expected x to be greater than or equal to 0, but got ${args.x}`,
    });
  }

  if (args.x >= args.field.width) {
    return createFeedback({
      ok: false,
      code: "X_BIGGER_THAN_FIELD_WIDTH",
      reason: `expected x to be less than the field width, but got x: ${args.x}, field width: ${args.field.width}`,
    });
  }

  return createFeedback({ ok: true, data: args.x });
};
