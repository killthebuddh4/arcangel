import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";
import { getRgbFromLabel } from "./getRgbFromLabel.js";

export const getRgbFromCode = (args: {
  code: number;
}): Feedback<[number, number, number]> => {
  const rgb = getRgbFromLabel({ label: COLORS[args.code] });

  if (!rgb.ok) {
    return createFeedback({
      ok: false,
      code: "INVALID_COLOR_CODE",
      reason: `Invalid color code, expected 0-9, got: ${args.code}`,
    });
  }

  return rgb;
};

const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray",
] as const;
