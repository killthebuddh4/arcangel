import * as Arc from "./Arc.js";

export const getNumCols = (args: { grid: Arc.Grid }) => {
  return args.grid.cells[0].length;
};
