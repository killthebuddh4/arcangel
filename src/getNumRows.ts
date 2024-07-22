import * as Arc from "./Arc.js";

export const getNumRows = (args: { grid: Arc.Grid }) => {
  return args.grid.cells.length;
};
