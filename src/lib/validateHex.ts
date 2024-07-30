import { Feedback } from "../types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const validateHex = (args: { hex: string }): Feedback<string> => {
  const n = parseInt(args.hex, 16);

  if (isNaN(n)) {
    return createFeedback({
      ok: false,
      code: "INVALID_HEX",
      reason: "Invalid hex.",
    });
  }

  return createFeedback({
    ok: true,
    data: args.hex,
  });
};
