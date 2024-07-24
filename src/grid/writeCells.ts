import { Grid } from "./Grid.js";
import { Cell } from "./Cell.js";
import { getCell } from "./getCell.js";

export const writeCells = (args: { grid: Grid; cells: Cell[] }) => {
  for (const cell of args.cells) {
    const existingCell = getCell({
      canvas: args.grid,
      x: cell.x,
      y: cell.y,
    });

    if (existingCell === undefined) {
      args.grid.cells.push(cell);
    } else {
      existingCell.value = cell.value;
    }
  }

  return args.grid;
};
