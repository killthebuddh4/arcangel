import { Grid } from "./Grid.js";
export const getWidth = (args: { grid: Grid }) => {
  return Math.max(...args.grid.cells.map((cell) => cell.x));
};
