import { Field } from "./Field.js";
import { read } from "./read.js";
import { compareValues } from "./compareValues.js";

type CompareResult =
  | {
      result: "equal";
    }
  | {
      result: "wrong dimensions";
    }
  | {
      result: "mismatch points";
      mismatches: Array<{
        x: number;
        y: number;
      }>;
    };

export const compare = (args: { a: Field; b: Field }): CompareResult => {
  if (args.a.width !== args.b.width || args.a.height !== args.b.height) {
    return {
      result: "wrong dimensions",
    };
  }

  const mismatches: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < args.a.height; y++) {
    for (let x = 0; x < args.a.width; x++) {
      const pointA = read({ field: args.a, x, y });

      if (!pointA.ok) {
        throw new Error(pointA.reason);
      }

      const pointB = read({ field: args.b, x, y });

      if (!pointB.ok) {
        throw new Error(pointB.reason);
      }

      if (
        !compareValues({
          a: pointA.data.value,
          b: pointB.data.value,
        })
      ) {
        mismatches.push({
          x,
          y,
        });
      }
    }
  }

  if (mismatches.length > 0) {
    return {
      result: "mismatch points",
      mismatches,
    };
  }

  return {
    result: "equal",
  };
};
