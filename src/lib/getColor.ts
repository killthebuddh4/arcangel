import { Color } from "../types/Color.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { getColors } from "./getColors.js";

export const getColor = (args: { code: number }): Maybe<Color> => {
  if (!Number.isInteger(args.code)) {
    return createMaybe({
      ok: false,
      code: "CODE_NOT_AN_INTEGER",
      reason: `The code ${args.code} is not an integer.`,
    });
  }

  if (args.code < 0) {
    return createMaybe({
      ok: false,
      code: "CODE_LESS_THAN_ZERO",
      reason: `The code ${args.code} is less than zero.`,
    });
  }

  if (args.code > 9) {
    return createMaybe({
      ok: false,
      code: "CODE_GREATER_THAN_NINE",
      reason: `The code ${args.code} is greater than nine.`,
    });
  }

  return createMaybe({
    ok: true,
    data: getColors()[args.code] as Color,
  });
};
