import * as Arc from "../Arc.js";

type Rotation = {
  degrees: 90 | 180 | 270 | -90 | -180 | -270;
};

export const rotate = (args: { grid: Arc.Grid; rotation: Rotation }) => {
  switch (args.rotation.degrees) {
    case 90:
    case -270:
      return rotate90({ grid: args.grid });
    case 180:
    case -180:
      return rotate90({ grid: rotate90({ grid: args.grid }) });
    case 270:
    case -90:
      return rotate90({
        grid: rotate90({ grid: rotate90({ grid: args.grid }) }),
      });
    default:
      throw new Error(
        `Invalid rotation degrees found: ${args.rotation.degrees}`,
      );
  }
};

const rotate90 = (args: { grid: Arc.Grid }) => {
  const rows = args.grid.length;
  const cols = args.grid[0].length;

  // rows -> cols
  // cols -> rows
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(null));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      console.log("rows", rows);
      console.log("cols", cols);
      console.log("rotatedRows", rotated.length);
      console.log("rotatedCols", rotated[0].length);
      console.log("row", row);
      console.log("col", col);
      rotated[col][rows - 1 - row] = args.grid[row][col];
    }
  }

  return rotated;
};
