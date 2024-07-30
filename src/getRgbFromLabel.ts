import { Feedback } from "./types/Feedback.js";
import { createFeedback } from "./createFeedback.js";

export const getRgbFromLabel = (args: {
  label: string;
}): Feedback<[number, number, number]> => {
  const rgb: [number, number, number] | null = (() => {
    switch (args.label) {
      case "red":
        return [255, 0, 0];
      case "orange":
        return [255, 165, 0];
      case "yellow":
        return [255, 255, 0];
      case "green":
        return [0, 255, 0];
      case "blue":
        return [0, 0, 255];
      case "purple":
        return [128, 0, 128];
      case "pink":
        return [255, 192, 203];
      case "brown":
        return [165, 42, 42];
      case "gray":
        return [128, 128, 128];
      case "black":
        return [0, 0, 0];
      default:
        return null;
    }
  })();

  if (rgb === null) {
    return createFeedback({
      ok: false,
      code: "INVALID_COLOR",
      reason: `Invalid color: ${args.label}`,
    });
  } else {
    return createFeedback({
      ok: true,
      data: rgb,
    });
  }
};
