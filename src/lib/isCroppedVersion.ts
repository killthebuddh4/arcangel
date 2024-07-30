import { createRelation } from "./createRelation.js";
import { Observation } from "../types/Observation.js";
import { Field } from "../types/Field.js";
import { diff } from "./getDiff.js";
import { crop } from "../field/crop.js";
import { clone } from "../field/filter.js";

const id = "isCropped";

const description = `The relation is satisfied if and only if there is some region R in the LHS field such that R has the same dimensions and points as the RHS field.`;

const evaluate = (lhs: Field, rhs: Field): Observation => {
  const doDimensionMakeSense =
    rhs.height <= lhs.height && rhs.width <= lhs.width;

  if (!doDimensionMakeSense) {
    return {
      isPositive: false,
      notes: `The RHS field cannot fit within the LHS field. The LHS field has height: ${lhs.height}, width: ${lhs.width}, the RHS field has height: ${rhs.height}, width: ${rhs.width}.`,
    };
  }

  const metrics = {
    minMismatchX: 0,
    minMismatchY: 0,
    minMismatch: Infinity,
  };

  for (let y = 0; y < lhs.height - rhs.height + 1; y++) {
    for (let x = 0; x < lhs.width - rhs.width + 1; x++) {
      const cloned = clone({ field: lhs });

      const cropped = crop({
        field: cloned,
        x,
        y,
        width: rhs.width,
        height: rhs.height,
      });

      if (!cropped.ok) {
        console.log(`LHS width: ${lhs.width}, CLONED width: ${cloned.width}`);
        throw new Error(cropped.reason);
      }

      const comparison = diff({ lhs: cropped.data, rhs: rhs });

      if (comparison.result === "wrong dimensions") {
        throw new Error(
          `We cropped using RHS but they don't have the same dimensions?`,
        );
      }

      if (comparison.result === "equal") {
        return {
          isPositive: true,
          // TODO What if multiple croppings would have worked?
          notes: `The RHS field is a crop of the LHS field at x: ${x}, y: ${y}.`,
        };
      }

      const mismatch = comparison.mismatches.length;

      if (mismatch < metrics.minMismatch) {
        metrics.minMismatch = mismatch;
      }
    }
  }

  const size = rhs.height * rhs.width;

  const percentMismatch = (metrics.minMismatch / size) * 100;

  return {
    isPositive: false,
    notes: `The RHS field does not match any region of the LHS field. The closest region, found at x: ${metrics.minMismatchX}, y: ${metrics.minMismatchY}, has ${percentMismatch}% of the points not matching.`,
  };
};

export const isCropped = createRelation({
  id,
  description,
  evaluate,
});
