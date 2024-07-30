import { Maybe } from "../types/Maybe.js";
import { Grid } from "../types/Grid.js";
import { Cell } from "../types/Cell.js";
import { parseHeight } from "./parseHeight.js";
import { createMaybe } from "./createMaybe.js";
import { createCell } from "./createCell.js";
import { Color } from "../types/Color.js";

export const createGrid = (args: {
  height: number;
  width: number;
  color?: Color;
  cells?: Cell[][];
}): Maybe<Grid> => {
  const maybeHeight = parseHeight({ n: args.height });

  if (!maybeHeight.ok) {
    return createMaybe({
      ok: false,
      code: "HEIGHT_ARG_INVALID",
      reason: maybeHeight,
    });
  }

  const maybeWidth = parseHeight({ n: args.width });

  if (!maybeWidth.ok) {
    return createMaybe({
      ok: false,
      code: "WIDTH_ARG_INVALID",
      reason: maybeWidth,
    });
  }

  if (args.cells !== undefined) {
    if (args.cells.length !== maybeHeight.data) {
      return createMaybe({
        ok: false,
        code: "CELLS_HEIGHT_MISMATCH",
        reason: `The height of the cells array ${args.cells.length} does not match the height ${maybeHeight.data}.`,
      });
    }

    for (let y = 0; y < maybeHeight.data; y++) {
      if (args.cells[y].length !== maybeWidth.data) {
        return createMaybe({
          ok: false,
          code: "CELLS_WIDTH_MISMATCH",
          reason: `The width of the cells array at index ${y} does not match the width ${maybeWidth.data}. Got ${args.cells[y].length} instead.`,
        });
      }

      for (let x = 0; x < maybeWidth.data; x++) {
        const cell = args.cells[y][x];

        if (cell.x !== x) {
          return createMaybe({
            ok: false,
            code: "CELL_X_MISMATCH",
            reason: `The x-coordinate of the cell at index ${y},${x} does not match the expected value of ${x}. Got ${cell.x} instead.`,
          });
        }

        if (cell.y !== y) {
          return createMaybe({
            ok: false,
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
          return createMaybe({
            ok: false,
            code: "CREATE_CELL_FAILED",
            reason: cell,
          });
        }

        row.push(cell.data);
      }
    }

    cells.push(row);
  }

  return createMaybe({
    ok: true,
    data: {
      height: maybeHeight.data,
      width: maybeWidth.data,
      cells,
    },
  });
};
