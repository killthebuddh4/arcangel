import * as Arc from "../Arc.js";
import { clone } from "./clone.js";

export const getPadded = (args: {
  field: Arc.Field;
  dimensions: { x: number; y: number };
}) => {
  if (args.dimensions.x < args.field.dimensions.x) {
    throw new Error(
      `Cannot pad field to smaller x dimension. Field x dimension is ${args.field.dimensions.x}, requested x dimension is ${args.dimensions.x}.`,
    );
  }

  if (args.dimensions.y < args.field.dimensions.y) {
    throw new Error(
      `Cannot pad field to smaller y dimension. Field y dimension is ${args.field.dimensions.y}, requested y dimension is ${args.dimensions.y}.`,
    );
  }

  const cloned = clone({ field: args.field });

  cloned.dimensions.x = args.dimensions.x;
  cloned.dimensions.y = args.dimensions.y;

  for (let x = 0; x < args.dimensions.x; x++) {
    for (let y = 0; y < args.dimensions.y; y++) {
      const point = cloned.points.find(
        (point) => point.x === x && point.y === y,
      );

      if (point === undefined) {
        cloned.points.push({ x, y, z: 0 });
      }
    }
  }

  return cloned;
};
