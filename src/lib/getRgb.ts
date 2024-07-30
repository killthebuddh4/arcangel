import { Color } from "../types/Color.js";
import { Rgb } from "../types/Rgb.js";
import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";

export const getRgb = (args: { color: Color }): Maybe<Rgb> => {
  let value: Rgb;
  switch (args.color) {
    case "red":
      value = [255, 0, 0];
      break;
    case "orange":
      value = [255, 165, 0];
      break;
    case "yellow":
      value = [255, 255, 0];
      break;
    case "green":
      value = [0, 255, 0];
      break;
    case "blue":
      value = [0, 0, 255];
      break;
    case "purple":
      value = [128, 0, 128];
      break;
    case "pink":
      value = [255, 192, 203];
      break;
    case "brown":
      value = [165, 42, 42];
      break;
    case "gray":
      value = [128, 128, 128];
      break;
    case "black":
      value = [0, 0, 0];
      break;
    case "white":
      value = [255, 255, 255];
      break;
    default:
      return createMaybe({
        ok: false,
        code: "COLOR_NOT_FOUND",
        reason: `The color ${args.color} is not found.`,
      });
  }

  return createMaybe({
    ok: true,
    data: value,
  });
};
