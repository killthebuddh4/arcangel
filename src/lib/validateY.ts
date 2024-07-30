import { Field } from "../types/Field.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

export const validateY = (args: {
  field: Field;
  y: number;
}): Feedback<number> => {
  if (!Number.isInteger(args.y)) {
    return createFeedback({
      ok: false,
      code: "Y_IS_NOT_INTEGER",
      reason: `expected y to be an integer, but got ${args.y}`,
    });
  }

  if (args.y < 0) {
    return createFeedback({
      ok: false,
      code: "Y_IS_NEGATIVE",
      reason: `expected y to be greater than or equal to 0, but got ${args.y}`,
    });
  }

  if (args.y >= args.field.width) {
    return createFeedback({
      ok: false,
      code: "Y_BIGGER_THAN_FIELD_WIDTH",
      reason: `expected y to be less than the field width, but got x: ${args.y}, field width: ${args.field.width}`,
    });
  }

  return createFeedback({ ok: true, data: args.y });
};
