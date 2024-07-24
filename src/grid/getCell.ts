import { Grid } from "./Grid.js";
import { Cell } from "./Cell.js";
import { ParseResult } from "../ParseResult.js";

export const getCell = (args: {
  x: number;
  y: number;
  grid: Grid;
}): ParseResult<Cell> => {
  if (args.x < 0) {
    return {
      ok: false,
      reason: `x must be greater than or equal to 0, but got ${args.x}`,
    };
  }

  if (args.x >= args.grid.width) {
    return {
      ok: false,
      reason: `x must be less than ${args.grid.width}, but got ${args.x}`,
    };
  }

  if (args.y < 0) {
    return {
      ok: false,
      reason: `y must be greater than or equal to 0, but got ${args.y}`,
    };
  }

  if (args.y >= args.grid.height) {
    return {
      ok: false,
      reason: `y must be less than ${args.grid.height}, but got ${args.y}`,
    };
  }

  return {
    ok: true,
    data: args.grid.cells[args.y][args.x],
  };
};
