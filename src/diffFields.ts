import { Field } from "./Field.js";
import { read } from "./getPoint.js";
import { compareRgb } from "../field/compareRgb.js";
import { Feedback } from "./Feedback.js";
import { getYs } from "../field/getYs.js";
import { getXs } from "../field/getXs.js";
import { createFeedback } from "./createFeedback.js";

export const diff = (args: {
  lhs: Field;
  rhs: Field;
}): Feedback<{
  mismatches: Array<{ x: number; y: number }>;
}> => {
  if (
    args.lhs.width !== args.rhs.width ||
    args.lhs.height !== args.rhs.height
  ) {
    return createFeedback({
      ok: false,
      code: "WRONG_DIMENSIONS",
      reason: `expected dimensions to be equal, but got ${args.lhs.width}x${args.lhs.height} and ${args.rhs.width}x${args.rhs.height}`,
    });
  }

  const mismatches: Array<{ x: number; y: number }> = [];

  for (let y of getYs({ field: args.lhs })) {
    for (let x of getXs({ field: args.lhs })) {
      const rgbA = read({ field: args.lhs, x, y });
      const rgbB = read({ field: args.rhs, x, y });

      if (
        !compareRgb({
          a: rgbA,
          b: rgbB,
        })
      ) {
        mismatches.push({
          x,
          y,
        });
      }
    }
  }

  return createFeedback({
    ok: true,
    data: { mismatches },
  });
};
