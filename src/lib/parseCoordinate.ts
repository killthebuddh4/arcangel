import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

const MAX_SIZE = 30;

export const parseCoordinate = (args: { n: number }): Maybe<number> => {
  if (!Number.isInteger(args.n)) {
    return createMaybe({
      ok: false,
      code: "COORDINATE_NOT_AN_INTEGER",
      reason: `The coordinate ${args.n} is not an integer.`,
    });
  }

  if (args.n < 0) {
    return createMaybe({
      ok: false,
      code: "COORDINATE_LESS_THAN_ZERO",
      reason: `The coordinate ${args.n} is less than zero.`,
    });
  }

  if (args.n >= MAX_SIZE) {
    return createMaybe({
      ok: false,
      code: "COORDINATE_GREATER_THAN_MAX_SIZE",
      reason: `The coordinate ${args.n} is greater than or equal to the maximum size of ${MAX_SIZE}.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.n,
  });
};
