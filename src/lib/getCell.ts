import { Cell } from "../types/Cell.js";
import { Grid } from "../types/Grid.js";
import { parseCoordinate } from "./parseCoordinate.js";
import { createException } from "./createException.js";

export const getCell = (args: { grid: Grid; x: number; y: number }): Cell => {
  const maybeX = parseCoordinate({ n: args.x });

  if (!maybeX.ok) {
    throw createException({
      code: "X_ARG_INVALID",
      reason: "TODO",
    });
  }

  const maybeY = parseCoordinate({ n: args.y });

  if (!maybeY.ok) {
    throw createException({
      code: "Y_ARG_INVALID",
      reason: "TODO",
    });
  }

  if (maybeX.data >= args.grid.width) {
    throw createException({
      code: "X_OUT_OF_BOUNDS",
      reason: `The x-coordinate ${maybeX.data} is out of bounds, must be less than ${args.grid.width}.`,
    });
  }

  if (maybeY.data >= args.grid.height) {
    throw createException({
      code: "Y_OUT_OF_BOUNDS",
      reason: `The y-coordinate ${maybeY.data} is out of bounds, must be less than ${args.grid.height}.`,
    });
  }

  return args.grid.cells[maybeY.data][maybeX.data];
};
