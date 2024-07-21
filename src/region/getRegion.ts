import * as Arc from "../Arc.js";
import { getAdjacentPoints } from "./getAdjacentPoints.js";

export const getRegion = (args: {
  field: Arc.Field;
  pointInRegion: Arc.Point;
  pointIsInRegion: (point: Arc.Point) => boolean;
}) => {
  const pointsInRegion: Arc.Point[] = [];

  const pointsHasPoint = (point: Arc.Point) => {
    return Boolean(
      pointsInRegion.find((p) => p.x === point.x && p.y === point.y),
    );
  };

  const dfs = (point: Arc.Point) => {
    if (pointsHasPoint(point)) return;
    if (!args.pointIsInRegion(point)) return;

    pointsInRegion.push(point);

    // TODO: It's not impossible that some problems might assume
    // diagonal connections are connected.

    const adjacentPoints = getAdjacentPoints({
      point,
      field: args.field,
    });

    for (const adjacentPoint of adjacentPoints) {
      dfs(adjacentPoint);
    }
  };

  dfs(args.pointInRegion);

  return pointsInRegion;
};
