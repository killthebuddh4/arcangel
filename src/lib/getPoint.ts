import { Field } from "../types/Field.js";
import { Point } from "../types/Point.js";
import { validateX } from "./validateX.js";
import { validateY } from "./validateY.js";
import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

export const getPoint = (args: {
  field: Field;
  x: number;
  y: number;
}): Feedback<Point> => {
  const y = validateY({ field: args.field, y: args.y });

  if (!y.ok) {
    return y;
  }

  const x = validateX({ field: args.field, x: args.x });

  if (!x.ok) {
    return x;
  }

  return createFeedback({
    ok: true,
    data: args.field.points[args.y][args.x],
  });
};
