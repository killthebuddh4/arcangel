import { Field } from "./Field.js";
import { Point } from "./Point.js";
import { Maybe } from "../Maybe.js";

export const resize = (args: {
  field: Field;
  height: number;
  width: number;
}): Maybe<boolean> => {
  if (args.height < 1) {
    return {
      ok: false,
      reason: `expected height to be greater than or equal to 1, but got ${args.height}`,
    };
  }

  if (args.width < 1) {
    return {
      ok: false,
      reason: `expected width to be greater than or equal to 1, but got ${args.width}`,
    };
  }

  const points: Point[][] = [];

  for (let y = 0; y < args.height; y++) {
    points.push([]);

    for (let x = 0; x < args.width; x++) {
      if (x >= args.field.width || y >= args.field.height) {
        points[y].push({
          x,
          y,
          value: [255, 255, 255],
        });
      } else {
        points[y].push({
          x,
          y,
          value: args.field.points[y][x].value,
        });
      }
    }
  }

  args.field.points = points;
  args.field.height = args.height;
  args.field.width = args.width;

  return {
    ok: true,
    data: true,
  };
};
