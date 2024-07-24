import { Grid } from "./Grid.js";
import { Cell } from "./Cell.js";
import { getCell } from "./getCell.js";
import { Maybe } from "../Maybe.js";

export const writeCells = (args: {
  grid: Grid;
  cells: Cell[];
}): Maybe<Grid> => {
  for (const cell of args.cells) {
    const previous = getCell({ x: cell.x, y: cell.y, grid: args.grid });

    if (!previous.ok) {
      return previous;
    }

    previous.data.color = cell.color;
  }

  return {
    ok: true,
    data: args.grid,
  };
};
