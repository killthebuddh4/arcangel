import { Field } from "../types/Field.js";
import { validateX } from "./validateX.js";
import { validateY } from "./validateY.js";
import { validateHex } from "./validateHex.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";
import { Point } from "../types/Point.js";

export const setPoint = (args: {
  field: Field;
  point: Point;
}): Feedback<undefined> => {
  const maybeX = validateX({ field: args.field, x: args.point.x });

  if (!maybeX.ok) {
    return maybeX;
  }

  const maybeY = validateY({ field: args.field, y: args.point.y });

  if (!maybeY.ok) {
    return maybeY;
  }

  const maybeHex = validateHex({ hex: args.point.value });

  if (!maybeHex.ok) {
    return maybeHex;
  }

  args.field.points[maybeY.data][maybeX.data] = {
    x: maybeX.data,
    y: maybeY.data,
    value: maybeHex.data,
  };

  return createFeedback({
    ok: true,
    data: undefined,
  });
};
