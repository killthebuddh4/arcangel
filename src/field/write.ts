import { Field } from "./Field.js";
import { Value } from "./Value.js";
import { Feedback } from "../feedback/Feedback.js";
import { createFeedback } from "../feedback/createFeedback.js";

type WriteFeedbackCode =
  | "NEGATIVE_X"
  | "NEGATIVE_Y"
  | "TOO_LARGE_X"
  | "TOO_LARGE_Y";

export const write = (args: {
  field: Field;
  x: number;
  y: number;
  value: Value;
}): Feedback<Field, WriteFeedbackCode> => {
  if (args.x < 0) {
    return createFeedback({
      ok: false,
      code: "NEGATIVE_X",
      reason: `expected x to be greater than or equal to 0, but got ${args.x}`,
    });
  }

  if (args.y < 0) {
    return createFeedback({
      ok: false,
      code: "NEGATIVE_Y",
      reason: `expected y to be greater than or equal to 0, but got ${args.y}`,
    });
  }

  if (args.x >= args.field.width) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_X",
      reason: `expected x to be less than ${args.field.width}, but got ${args.x}`,
    });
  }

  if (args.y >= args.field.height) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_Y",
      reason: `expected y to be less than ${args.field.height}, but got ${args.y}`,
    });
  }

  args.field.points[args.y][args.x].value = args.value;

  return createFeedback({
    ok: true,
    data: args.field,
  });
};
