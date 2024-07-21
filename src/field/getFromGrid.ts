import * as Arc from "../Arc.js";

export const getFromGrid = (args: { grid: Arc.Grid }) => {
  const field = {
    points: [] as Arc.Point[],
    dimensions: {
      y: args.grid.length,
      x: args.grid[0].length,
    },
  };

  for (let y = 0; y < field.dimensions.y; y++) {
    for (let x = 0; x < field.dimensions.x; x++) {
      field.points.push({
        x,
        y,
        z: args.grid[y][x],
      });
    }
  }

  return field;
};
