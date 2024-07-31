import { Grid } from "../types/Grid.js";
import { Cell } from "../types/Cell.js";
import { parseHeight } from "./parseHeight.js";
import { createCell } from "./createCell.js";
import { Color } from "../types/Color.js";
import { createException } from "./createException.js";

export const createGrid = (args: {
  height: number;
  width: number;
  color?: Color;
  cells?: Cell[][];
}): Grid => {
  const maybeHeight = parseHeight({ n: args.height });

  if (!maybeHeight.ok) {
    throw createException({
      code: "HEIGHT_ARG_INVALID",
      reason: "TODO",
    });
  }

  const maybeWidth = parseHeight({ n: args.width });

  if (!maybeWidth.ok) {
    throw createException({
      code: "WIDTH_ARG_INVALID",
      reason: "TODO",
    });
  }

  if (args.cells !== undefined) {
    if (args.cells.length !== maybeHeight.data) {
      throw createException({
        code: "CELLS_HEIGHT_MISMATCH",
        reason: `The height of the cells array ${args.cells.length} does not match the height ${maybeHeight.data}.`,
      });
    }

    for (let y = 0; y < maybeHeight.data; y++) {
      if (args.cells[y].length !== maybeWidth.data) {
        throw createException({
          code: "CELLS_WIDTH_MISMATCH",
          reason: `The width of the cells array at index ${y} does not match the width ${maybeWidth.data}. Got ${args.cells[y].length} instead.`,
        });
      }

      for (let x = 0; x < maybeWidth.data; x++) {
        const cell = args.cells[y][x];

        if (cell.x !== x) {
          throw createException({
            code: "CELL_X_MISMATCH",
            reason: `The x-coordinate of the cell at index ${y},${x} does not match the expected value of ${x}. Got ${cell.x} instead.`,
          });
        }

        if (cell.y !== y) {
          throw createException({
            code: "CELL_Y_MISMATCH",
            reason: `The y-coordinate of the cell at index ${y},${x} does not match the expected value of ${y}. Got ${cell.y} instead.`,
          });
        }
      }
    }
  }

  const cells: Cell[][] = [];

  for (let y = 0; y < maybeHeight.data; y++) {
    const row: Cell[] = [];

    for (let x = 0; x < maybeWidth.data; x++) {
      if (args.cells !== undefined) {
        row.push(args.cells[y][x]);
      } else {
        const cell = createCell({ x, y, color: args.color ?? "black" });

        if (!cell.ok) {
          throw createException({
            code: "CREATE_CELL_FAILED",
            reason: "TODO",
          });
        }

        row.push(cell.data);
      }
    }

    cells.push(row);
  }

  return {
    height: maybeHeight.data,
    width: maybeWidth.data,
    cells,
  };
};
