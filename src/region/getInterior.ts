import * as Arc from "../Arc.js";
import { getAdjacentPoints } from "./getAdjacentPoints.js";

export const getInterior = (args: {
  field: Arc.Field;
  pointsInRegion: Arc.Point[];
}) => {
  const isInteriorPoint = (point: Arc.Point) => {
    const adjacentPoints = getAdjacentPoints({
      point,
      field: args.field,
    });

    return adjacentPoints.every((p) => {
      return Boolean(
        args.pointsInRegion.find((pit) => pit.x === p.x && pit.y === p.y),
      );
    });
  };

  const interiorPoints: Arc.Point[] = [];

  for (const point of args.pointsInRegion) {
    if (isInteriorPoint(point)) {
      interiorPoints.push(point);
    }
  }

  return interiorPoints;
};
