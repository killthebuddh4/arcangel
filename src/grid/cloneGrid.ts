import { Grid } from "./Grid.js";
import { createGrid } from "./createGrid.js";

export const cloneGrid = (args: { grid: Grid }) => {
  return createGrid({
    height: args.grid.height,
    width: args.grid.width,
    opts: {
      cells: args.grid.cells.map((row) => {
        return row.map((cell) => {
          return {
            x: cell.x,
            y: cell.y,
            color: cell.color,
          };
        });
      }),
    },
  });
};
