import { ParseResult } from "./ParseResult.js";

export const readRgb = (args: {
  value: number;
}): ParseResult<[number, number, number]> => {
  const rgb: [number, number, number] | undefined = (() => {
    switch (args.value) {
      case 0:
        return [0, 0, 0];
      case 1:
        return [30, 147, 255];
      case 2:
        return [249, 60, 49];
      case 3:
        return [79, 204, 48];
      case 4:
        return [255, 220, 0];
      case 5:
        return [153, 153, 153];
      case 6:
        return [229, 58, 163];
      case 7:
        return [255, 133, 27];
      case 8:
        return [0, 212, 255];
      case 9:
        return [146, 18, 49];
      default:
        return undefined;
    }
  })();

  if (rgb === undefined) {
    return {
      ok: false,
      reason: `Invalid value ${args.value}`,
    };
  }

  return {
    ok: true,
    data: rgb,
  };
};
