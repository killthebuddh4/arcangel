import { Field } from "./Field.js";
import { Point } from "./Point.js";
import { Feedback } from "../feedback/Feedback.js";
import { createFeedback } from "../feedback/createFeedback.js";

export const create = (args: {
  height: number;
  width: number;
}): Feedback<Field> => {
  if (args.height < 1) {
    return createFeedback({
      ok: false,
      reason: `expected height to be greater than or equal to 1, but got ${args.height}`,
    });
  }

  if (args.width < 1) {
    return createFeedback({
      ok: false,
      reason: `expected width to be greater than or equal to 1, but got ${args.width}`,
    });
  }

  const points: Point[][] = [];

  for (let y = 0; y < args.height; y++) {
    points.push([]);

    for (let x = 0; x < args.width; x++) {
      points[y].push({
        x,
        y,
        value: [255, 255, 255],
      });
    }
  }

  return createFeedback({
    ok: true,
    data: {
      height: args.height,
      width: args.width,
      points,
    },
  });
};
