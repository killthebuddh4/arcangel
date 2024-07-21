import * as Arc from "../Arc.js";
import { getPoint } from "../field/getPoint.js";

export const getAdjacentPoints = (args: {
  point: Arc.Point;
  field: Arc.Field;
}) => {
  const adjacentPoints = [];

  const left = getPoint({
    field: args.field,
    x: args.point.x - 1,
    y: args.point.y,
  });

  if (left !== undefined) adjacentPoints.push(left);

  const right = getPoint({
    field: args.field,
    x: args.point.x + 1,
    y: args.point.y,
  });

  if (right !== undefined) adjacentPoints.push(right);

  const up = getPoint({
    field: args.field,
    x: args.point.x,
    y: args.point.y - 1,
  });

  if (up !== undefined) adjacentPoints.push(up);

  const down = getPoint({
    field: args.field,
    x: args.point.x,
    y: args.point.y + 1,
  });

  if (down !== undefined) adjacentPoints.push(down);

  return adjacentPoints;
};
