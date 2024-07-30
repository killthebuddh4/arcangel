import { Maybe } from "../types/Maybe.js";
import { Cell } from "../types/Cell.js";
import { Color } from "../types/Color.js";
import { parseCoordinate } from "./parseCoordinate.js";
import { createMaybe } from "./createMaybe.js";

export const createCell = (args: {
  x: number;
  y: number;
  color: Color;
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

  return createMaybe({
    ok: true,
    data: {
      x: maybeX.data,
      y: maybeY.data,
      color: args.color,
    },
  });
};
