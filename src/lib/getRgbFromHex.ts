import { Feedback } from "../types/Feedback.js";
import { validateHex } from "./validateHex.js";
import { createFeedback } from "./createFeedback.js";

export const getRgbFromHex = (args: {
  hex: string;
}): Feedback<[number, number, number]> => {
  const maybeHex = validateHex({ hex: args.hex });

  if (!maybeHex.ok) {
    return createFeedback({
      ok: false,
      code: "INPUT_NOT_HEX_STRING",
      reason: `Invalid hex string: ${args.hex}`,
    });
  }

  if (args.hex.length !== 8) {
    return createFeedback({
      ok: false,
      code: "HEX_PARSE_R_ERROR",
      reason: `Expected 8 char hex string (e.g. 0xfa12b3), got: ${args.hex}`,
    });
  }

  const r = parseInt(args.hex.slice(1, 3), 16);

  if (isNaN(r)) {
    return createFeedback({
      ok: false,
      code: "HEX_PARSE_G_ERROR",
      reason: `Invalid hex string: ${args.hex}`,
    });
  }

  const g = parseInt(args.hex.slice(3, 5), 16);

  if (isNaN(g)) {
    return createFeedback({
      ok: false,
      code: "INVALID_HEX_STRING",
      reason: `Invalid hex string: ${args.hex}`,
    });
  }

  const b = parseInt(args.hex.slice(5, 7), 16);

  if (isNaN(b)) {
    return createFeedback({
      ok: false,
      code: "HEX_PARSE_B_ERROR",
      reason: `Invalid hex string: ${args.hex}`,
    });
  }

  return createFeedback({
    ok: true,
    data: [r, g, b],
  });
};
