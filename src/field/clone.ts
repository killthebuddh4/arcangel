import { Field } from "./Field.js";
import { Point } from "./Point.js";

export const clone = (args: { field: Field }) => {
  const points: Point[][] = [];

  for (let y = 0; y < args.field.height; y++) {
    points.push([]);

    for (let x = 0; x < args.field.width; x++) {
      points[y].push({
        value: args.field.points[y][x].value,
        x,
        y,
      });
    }
  }

  return {
    height: args.field.height,
    width: args.field.width,
    points,
  };
};
