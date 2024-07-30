import { Field } from "../types/Field.js";
import { getPoint } from "./getPoint.js";
import { Feedback } from "../types/Feedback.js";
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
      code: "DIMENSION_MISMATCH",
      reason: `expected dimensions to be equal, but got ${args.lhs.width}x${args.lhs.height} and ${args.rhs.width}x${args.rhs.height}`,
    });
  }

  const mismatches: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < args.lhs.height; y++) {
    for (let x = 0; x < args.lhs.width; x++) {
      const maybeLhsPoint = getPoint({ field: args.lhs, x, y });

      if (!maybeLhsPoint.ok) {
        return maybeLhsPoint;
      }

      const maybeRhsPoint = getPoint({ field: args.rhs, x, y });

      if (!maybeRhsPoint.ok) {
        return maybeRhsPoint;
      }

      if (maybeLhsPoint.data.value !== maybeRhsPoint.data.value) {
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
