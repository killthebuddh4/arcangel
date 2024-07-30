import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { Grid } from "../types/Grid.js";
import { Cell } from "../types/Cell.js";
import { getCell } from "./getCell.js";

export const getDiff = (args: {
  lhs: Grid;
  rhs: Grid;
}): Maybe<{ diff: Cell[] }> => {
  if (args.lhs.height !== args.rhs.height) {
    return createMaybe({
      ok: false,
      code: "GRID_HEIGHT_MISMATCH",
      reason: `The grids have different heights: ${args.lhs.height} and ${args.rhs.height}.`,
    });
  }

  if (args.lhs.width !== args.rhs.width) {
    return createMaybe({
      ok: false,
      code: "GRID_WIDTH_MISMATCH",
      reason: `The grids have different widths: ${args.lhs.width} and ${args.rhs.width}.`,
    });
  }

  const diff: Cell[] = [];

  for (let y = 0; y < args.lhs.height; y++) {
    for (let x = 0; x < args.lhs.width; x++) {
      const maybeLhsCell = getCell({
        grid: args.lhs,
        x,
        y,
      });

      if (!maybeLhsCell.ok) {
        return createMaybe({
          ok: false,
          code: "GET_LHS_CELL_FAILED",
          reason: maybeLhsCell,
        });
      }

      const maybeRhsCell = getCell({
        grid: args.rhs,
        x,
        y,
      });

      if (!maybeRhsCell.ok) {
        return createMaybe({
          ok: false,
          code: "GET_RHS_CELL_FAILED",
          reason: maybeRhsCell,
        });
      }

      if (maybeLhsCell.data.color !== maybeRhsCell.data.color) {
        diff.push(maybeLhsCell.data);
      }
    }
  }

  return createMaybe({
    ok: true,
    data: { diff },
  });
};
