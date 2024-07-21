import * as Arc from "../Arc.js";
import { getAdjacentPoints } from "./getAdjacentPoints.js";

export const getBoundary = (args: {
  // TODO No guarantee that the points are all in the same space,
  // make sure to validate the points somehow.
  field: Arc.Field;
  pointsInRegion: Arc.Point[];
}) => {
  const isBoundaryPoint = (point: Arc.Point) => {
    const adjacentPoints = getAdjacentPoints({
      point,
      field: args.field,
    });

    return Boolean(
      adjacentPoints.find((p) => p.x === point.x && p.y === point.y),
    );
  };

  const boundaryPoints: Arc.Point[] = [];

  for (const point of args.pointsInRegion) {
    if (isBoundaryPoint(point)) {
      boundaryPoints.push(point);
    }
  }

  return boundaryPoints;
};
