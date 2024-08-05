import { createGrid } from "./createGrid.js";
import { createCell } from "./createCell.js";
import { Grid } from "../types/Grid.js";

export const getClone = (args: { grid: Grid }) => {
  return createGrid({
    height: args.grid.height,
    width: args.grid.width,
    color: "black",
    cells: args.grid.cells.map((row) => {
      return row.map((cell) => {
        const created = createCell({
          color: cell.color,
          x: cell.x,
          y: cell.y,
        });

        if (!created.ok) {
          throw new Error("TODO: Failed to create cell");
        }

        return created.data;
      });
    }),
  });
};
