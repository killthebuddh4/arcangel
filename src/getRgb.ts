import { Feedback } from "./types/Feedback.js";
import { isHex } from "./isHexString.js";
import { getRgbFromHex } from "./getRgbFromHex.js";
import { getRgbFromLabel } from "./getRgbFromLabel.js";
import { getRgbFromCode } from "./getRgbFromCode.js";

export const getRgb = (args: {
  color: string | number;
}): Feedback<[number, number, number]> => {
  if (typeof args.color === "number") {
    return getRgbFromCode({ code: args.color });
  }

  if (isHex(args.color)) {
    return getRgbFromHex({ hex: args.color });
  }

  return getRgbFromLabel({ label: args.color });
};
