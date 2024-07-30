import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

const MAX_SIZE = 30;

export const parseHeight = (args: { n: number }): Maybe<number> => {
  if (!Number.isInteger(args.n)) {
    return createMaybe({
      ok: false,
      code: "HEIGHT_NOT_AN_INTEGER",
      reason: `The height ${args.n} is not an integer.`,
    });
  }

  if (args.n < 1) {
    return createMaybe({
      ok: false,
      code: "HEIGHT_LESS_THAN_ONE",
      reason: `The height ${args.n} is less than one.`,
    });
  }

  if (args.n > MAX_SIZE) {
    return createMaybe({
      ok: false,
      code: "HEIGHT_GREATER_THAN_MAX_SIZE",
      reason: `The height ${args.n} is greater than the maximum size of ${MAX_SIZE}.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.n,
  });
};
