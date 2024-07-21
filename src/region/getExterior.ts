import { getPoint } from "../field/getPoint.js";
import * as Arc from "../Arc.js";

export const getExterior = (args: {
  field: Arc.Field;
  pointsInRegion: Arc.Point[];
}) => {
  const complementPoints: Arc.Point[] = [];

  for (let y = 0; y < args.field.dimensions.y; y++) {
    for (let x = 0; x < args.field.dimensions.x; x++) {
      const point = getPoint({
        field: args.field,
        x,
        y,
      });

      if (point === undefined) {
        throw new Error(
          "Point not found event though x and y are within bounds",
        );
      }

      if (
        !args.pointsInRegion.find(
          (pir) => pir.x === point.x && pir.y === point.y,
        )
      ) {
        complementPoints.push(point);
      }
    }
  }

  return complementPoints;
};
