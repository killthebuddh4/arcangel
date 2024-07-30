import { Maybe } from "../types/Maybe.js";
import { Cell } from "../types/Cell.js";
import { Grid } from "../types/Grid.js";
import { parseCoordinate } from "./parseCoordinate.js";
import { createMaybe } from "./createMaybe.js";

export const getCell = (args: {
  grid: Grid;
  x: number;
  y: number;
}): Maybe<Cell> => {
  const maybeX = parseCoordinate({ n: args.x });

  if (!maybeX.ok) {
    return createMaybe({
      ok: false,
      code: "X_ARG_INVALID",
      reason: maybeX,
    });
  }

  const maybeY = parseCoordinate({ n: args.y });

  if (!maybeY.ok) {
    return createMaybe({
      ok: false,
      code: "Y_ARG_INVALID",
      reason: maybeY,
    });
  }

  if (maybeX.data >= args.grid.width) {
    return createMaybe({
      ok: false,
      code: "X_OUT_OF_BOUNDS",
      reason: `The x-coordinate ${maybeX.data} is out of bounds, must be less than ${args.grid.width}.`,
    });
  }

  if (maybeY.data >= args.grid.height) {
    return createMaybe({
      ok: false,
      code: "Y_OUT_OF_BOUNDS",
      reason: `The y-coordinate ${maybeY.data} is out of bounds, must be less than ${args.grid.height}.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.grid.cells[maybeY.data][maybeX.data],
  });
};
