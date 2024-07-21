import * as Arc from "../Arc.js";
import { clone } from "./clone.js";
import { getPoint } from "./getPoint.js";

export const getRotated = (args: { field: Arc.Field; degrees: number }) => {
  switch (args.degrees) {
    case 90:
    case -270:
      return rotate90({ field: args.field });
    case 180:
    case -180:
      return rotate90({ field: rotate90({ field: args.field }) });
    case 270:
    case -90:
      return rotate90({
        field: rotate90({ field: rotate90({ field: args.field }) }),
      });
    default:
      throw new Error(
        `Invalid degrees: ${args.degrees}, must be +-90, +-180, or +-270`,
      );
  }
};

const rotate90 = (args: { field: Arc.Field }) => {
  const cloned = clone({ field: args.field });

  cloned.dimensions.x = args.field.dimensions.y;
  cloned.dimensions.y = args.field.dimensions.x;

  const rows = args.field.dimensions.y;
  const cols = args.field.dimensions.x;

  const points = [] as Arc.Point[];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const point = getPoint({ field: args.field, x, y });

      if (point === undefined) {
        throw new Error(
          `Point is undefined even though we should be within the field's dimensions. x: ${x}, y: ${y}, field dimensions: ${args.field.dimensions.x}x${args.field.dimensions.y}`,
        );
      }

      points.push({
        x: rows - 1 - y,
        y: x,
        z: point.z,
      });
    }
  }

  cloned.points = points;

  return cloned;
};
