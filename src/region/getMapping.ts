import * as Arc from "../Arc.js";

export const getMapping = (args: {
  field: Arc.Field;
  region: Arc.Point[];
  mapper: (point: Arc.Point) => Arc.Point;
}) => {
  return args.region.map(args.mapper);
};
