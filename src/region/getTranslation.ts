import * as Arc from "../Arc.js";

export const getTranslation = (args: {
  field: Arc.Field;
  region: Arc.Point[];
  x: number;
  y: number;
}) => {
  return args.region.map((point) => {
    return {
      x: point.x + args.x,
      y: point.y + args.y,
      z: point.z,
    };
  });
};
