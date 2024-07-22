import * as Arc from "./Arc.js";
import { getNumCols } from "./getNumCols.js";
import { getNumRows } from "./getNumRows.js";

export const getCell = (args: { grid: Arc.Grid; x: number; y: number }) => {
  const numRows = getNumRows({ grid: args.grid });
  const numCols = getNumCols({ grid: args.grid });

  if (args.y < 0 || args.y >= numRows || args.x < 0 || args.x >= numCols) {
    return undefined;
  }

  return args.grid.cells[args.y][args.x];
};
