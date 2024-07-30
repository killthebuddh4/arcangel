import { Color } from "../types/Color.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { getColors } from "./getColors.js";

export const parseColor = (args: { color: string }): Maybe<Color> => {
  if (!getColors().includes(args.color)) {
    return createMaybe({
      ok: false,
      code: "COLOR_NOT_FOUND",
      reason: `The color ${args.color} is not found.`,
    });
  }

  return createMaybe({
    ok: true,
    data: args.color as Color,
  });
};
