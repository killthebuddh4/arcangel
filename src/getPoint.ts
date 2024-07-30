import { Field } from "./Field.js";
import { Point } from "./Point.js";

export const read = (args: { field: Field; x: number; y: number }): Point => {
  return args.field.points[args.y][args.x];
};
