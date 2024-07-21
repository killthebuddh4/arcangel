import * as Arc from "../Arc.js";

export const getPoint = (args: { field: Arc.Field; x: number; y: number }) => {
  return args.field.points.find((p) => p.x === args.x && p.y === args.y);
};
