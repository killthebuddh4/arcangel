import { Field } from "../field/Field.js";
import { Feedback } from "../feedback/Feedback.js";
import { read } from "../field/read.js";
import { create } from "../field/create.js";
import { write } from "../field/write.js";
import { createFeedback } from "../feedback/createFeedback.js";

type CropFeedbackCode =
  | "NEGATIVE_X"
  | "NEGATIVE_Y"
  | "TOO_LARGE_X"
  | "TOO_LARGE_Y"
  | "HEIGHT_LESS_THAN_ONE"
  | "WIDTH_LESS_THAN_ONE"
  | "TOO_LARGE_X_PLUS_WIDTH"
  | "TOO_LARGE_Y_PLUS_HEIGHT";

export const crop = (args: {
  field: Field;
  x: number;
  y: number;
  height: number;
  width: number;
}): Feedback<Field, CropFeedbackCode> => {
  if (args.height < 1) {
    return createFeedback({
      ok: false,
      code: "HEIGHT_LESS_THAN_ONE",
      reason: `expected height to be greater than or equal to 1, but got ${args.height}`,
    });
  }

  if (args.width < 1) {
    return createFeedback({
      ok: false,
      code: "WIDTH_LESS_THAN_ONE",
      reason: `expected width to be greater than or equal to 1, but got ${args.width}`,
    });
  }

  if (args.x < 0) {
    return createFeedback({
      ok: false,
      code: "NEGATIVE_X",
      reason: `expected x to be greater than or equal to 0, but got ${args.x}`,
    });
  }

  if (args.x + args.width > args.field.width) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_X_PLUS_WIDTH",
      reason: `expected x + width to be less than or equal to the field width, but got x: ${args.x}, width: ${args.width}, field width: ${args.field.width}`,
    });
  }

  if (args.y < 0) {
    return createFeedback({
      ok: false,
      code: "NEGATIVE_Y",
      reason: `expected y to be greater than or equal to 0, but got ${args.y}`,
    });
  }

  if (args.y + args.height > args.field.height) {
    return createFeedback({
      ok: false,
      code: "TOO_LARGE_Y_PLUS_HEIGHT",
      reason: `expected y + height to be less than or equal to the field height, but got y: ${args.y}, height: ${args.height}, field height: ${args.field.height}`,
    });
  }

  const field = create({ height: args.height, width: args.width });

  if (!field.ok) {
    throw new Error(field.reason);
  }

  for (let y = args.y; y < args.y + args.height; y++) {
    for (let x = args.x; x < args.x + args.width; x++) {
      const point = read({ field: args.field, x, y });

      if (!point.ok) {
        throw new Error(point.reason);
      }

      write({
        field: field.data,
        x: x - args.x,
        y: y - args.y,
        value: point.data.value,
      });
    }
  }

  return createFeedback({
    ok: true,
    data: field.data,
  });
};
