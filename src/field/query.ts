import { Field } from "./Field.js";
import { Point } from "./Point.js";

export const query = (args: {
  field: Field;
  filter: (point: Point) => boolean;
}) => {
  const points = [];

  for (let y = 0; y < args.field.height; y++) {
    for (let x = 0; x < args.field.width; x++) {
      const point = args.field.points[y][x];
      if (args.filter(point)) {
        points.push(point);
      }
    }
  }

  return points;
};
