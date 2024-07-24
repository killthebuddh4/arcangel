import { Grid } from "./Grid.js";

export const getHeight = (args: { grid: Grid }): number => {
  return Math.max(...args.grid.cells.map((cell) => cell.y));
};
