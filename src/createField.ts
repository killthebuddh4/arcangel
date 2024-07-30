import { Field } from "./types/Field.js";
import { Point } from "./types/Point.js";

export const createField = (args: { height: number; width: number }): Field => {
  const field: Field = {
    height: args.height,
    width: args.width,
    points: [],
  };

  const points: Point[][] = [];

  for (let y = 0; y < args.height; y++) {
    points.push([]);

    for (let x = 0; x < args.width; x++) {
      points[y].push({
        x,
        y,
        value: "0xFFFFFF",
      });
    }
  }

  return field;
};
