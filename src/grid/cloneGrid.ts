import { Grid } from "./Grid.js";
import { createGrid } from "./createGrid.js";
import { getWidth } from "./getWidth.js";
import { getHeight } from "./getHeight.js";

export const cloneGrid = (args: { grid: Grid }): Grid => {
  return createGrid({
    height: getHeight({ grid: args.grid }),
    width: getWidth({ grid: args.grid }),
    opts: {
      cells: args.grid.cells.map((cell) => {
        return {
          x: cell.x,
          y: cell.y,
          value: cell.value,
        };
      }),
    },
  });
};
