import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

const MAX_SIZE = 30;

export const parseWidth = (args: { n: number }): Maybe<number> => {
  if (!Number.isInteger(args.n)) {
    return createMaybe({
      ok: false,
      code: "WIDTH_NOT_AN_INTEGER",
      reason: `The width ${args.n} is not an integer.`,
    });
  }

  if (args.n < 1) {
    return createMaybe({
      ok: false,
      code: "WIDTH_LESS_THAN_ONE",
      reason: `The width ${args.n} is less than one.`,
    });
  }

  if (args.n > MAX_SIZE) {
    return createMaybe({
      ok: false,
      code: "WIDTH_GREATER_THAN_MAX_SIZE",
      reason: `The width ${args.n} is greater than the maximum size of ${MAX_SIZE}.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.n,
  });
};
