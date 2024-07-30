import { createRelation } from "./createRelation.js";
import { Observation } from "./Observation.js";
import { Field } from "./Field.js";
import { rotate } from "./rotateField.js";
import { diff } from "./diffFields.js";

const id = "isRotation90";

const description = `The relation is satisfied if and only if the RHS field is a 90 degree rotation of the LHS.`;

const evaluate = (lhs: Field, rhs: Field): Observation => {
  const isSwappedDimensions =
    lhs.height === rhs.width && lhs.width === rhs.height;

  if (!isSwappedDimensions) {
    return {
      isPositive: false,
      notes: `A 90 degree rotation will have swapped dimensions. The LHS field has height: ${lhs.height}, width: ${lhs.width}, the RHS field has height: ${rhs.height}, width: ${rhs.width}.`,
    };
  }

  const rotated = rotate({ field: lhs });

  const isRotatedComparison = diff({ lhs: rotated, rhs: rhs });

  if (!(isRotatedComparison.result === "equal")) {
    const size = lhs.height * lhs.width;

    if (isRotatedComparison.result !== "mismatch points") {
      throw new Error(
        `Expected a mismatch points result, but got ${isRotatedComparison.result}.`,
      );
    }

    const percentMismatch =
      (isRotatedComparison.mismatches.length / size) * 100;

    return {
      isPositive: false,
      notes: `The RHS field has the correct dimensions, but ${percentMismatch}% of the points do not match.`,
    };
  }

  return {
    isPositive: true,
  };
};

export const isRotation90 = createRelation({
  id,
  description,
  evaluate,
});
