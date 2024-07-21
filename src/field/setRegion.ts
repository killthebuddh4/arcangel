import * as Arc from "../Arc.js";
import { clone } from "./clone.js";

export const setRegion = (args: { field: Arc.Field; region: Arc.Point[] }) => {
  const field = clone({ field: args.field });

  for (const point of args.region) {
    const fieldPoint = field.points.find(
      (p) => p.x === point.x && p.y === point.y,
    );

    if (fieldPoint === undefined) {
      console.warn(
        `Cannot apply point to field that does not exist within field's size. New point is x: ${point.x}, y: ${point.y}, z: ${point.z}, field dimensions are x: ${field.dimensions.x}, y: ${field.dimensions.y}.`,
      );
      continue;
    }

    fieldPoint.z = point.z;
  }

  return field;
};
