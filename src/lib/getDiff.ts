import { Grid } from "../types/Grid.js";
import { Cell } from "../types/Cell.js";
import { getCell } from "./getCell.js";
import { createException } from "./createException.js";

export const getDiff = (args: { lhs: Grid; rhs: Grid }): { diff: Cell[] } => {
  if (args.lhs.height !== args.rhs.height) {
    throw createException({
      code: "GRID_HEIGHT_MISMATCH",
      reason: `The grids have different heights: ${args.lhs.height} and ${args.rhs.height}.`,
    });
  }

  if (args.lhs.width !== args.rhs.width) {
    throw createException({
      code: "GRID_WIDTH_MISMATCH",
      reason: `The grids have different widths: ${args.lhs.width} and ${args.rhs.width}.`,
    });
  }

  const diff: Cell[] = [];

  for (let y = 0; y < args.lhs.height; y++) {
    for (let x = 0; x < args.lhs.width; x++) {
      const lhsCell = getCell({
        grid: args.lhs,
        x,
        y,
      });

      const rhsCell = getCell({
        grid: args.rhs,
        x,
        y,
      });

      if (lhsCell.color !== rhsCell.color) {
        diff.push(rhsCell);
      }
    }
  }

  return { diff };
};
