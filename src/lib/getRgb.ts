import { Feedback } from "../types/Feedback.js";
import { validateHex } from "./validateHex.js";
import { validateColorIndex } from "./validateColorIndex.js";
import { validateColorLabel } from "./validateColorLabel.js";
import { getRgbFromHex } from "./getRgbFromHex.js";
import { getRgbFromLabel } from "./getRgbFromLabel.js";
import { getRgbFromCode } from "./getRgbFromCode.js";
import { createFeedback } from "./createFeedback.js";

export const getRgb = (args: {
  color: string | number;
}): Feedback<[number, number, number]> => {
  if (typeof args.color === "number") {
    const maybeColorIndex = validateColorIndex({ index: args.color });

    if (maybeColorIndex.ok) {
      return getRgbFromCode({ code: maybeColorIndex.data });
    }
  }

  if (typeof args.color === "string") {
    const maybeHex = validateHex({ hex: args.color });

    if (maybeHex.ok) {
      return getRgbFromHex({ hex: args.color });
    }
  }

  if (typeof args.color === "string") {
    const maybeColorLabel = validateColorLabel({ label: args.color });

    if (maybeColorLabel.ok) {
      return getRgbFromLabel({ label: maybeColorLabel.data });
    }
  }

  return createFeedback({
    ok: false,
    code: "INVALID_COLOR",
    reason: `Invalid color: ${args.color}`,
  });
};
