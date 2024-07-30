import { createFeedback } from "./createFeedback.js";
import { Feedback } from "../types/Feedback.js";

export const validateColorLabel = (args: {
  label: string;
}): Feedback<string> => {
  if (!colors.includes(args.label)) {
    return createFeedback({
      ok: false,
      code: "INVALID_COLOR_LABEL",
      reason: `Invalid color label: ${args.label}`,
    });
  }

  return createFeedback({ ok: true, data: args.label });
};

const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "black",
  "white",
];
