import * as Arc from "../Arc.js";

export const clone = (args: { field: Arc.Field }) => {
  return {
    dimensions: {
      x: args.field.dimensions.x,
      y: args.field.dimensions.y,
    },
    points: args.field.points.map((point) => {
      if (point.x === 0 && point.y === 0) {
        console.log("ORIGIN IS IN CLONE");
      }
      return {
        x: point.x,
        y: point.y,
        z: point.z,
      };
    }),
  };
};
