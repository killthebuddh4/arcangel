import { createRelation } from "./createRelation.js";
import { Observation } from "../types/Observation.js";
import { Field } from "../types/Field.js";
import { getRotated } from "./getRotated.js";
import { diff } from "./getDiff.js";

const id = "isRotation180";

const description = `The relation is satisfied if and only if the RHS field is a 180 degree rotation of the LHS.`;

const evaluate = (lhs: Field, rhs: Field): Observation => {
  const isSameDimensions = lhs.height === rhs.height && lhs.width === rhs.width;

  if (!isSameDimensions) {
    return {
      isPositive: false,
      notes: `A 180 degree rotation will have the same dimensions. The LHS field has height: ${lhs.height}, width: ${lhs.width}, the RHS field has height: ${rhs.height}, width: ${rhs.width}.`,
    };
  }

  const rotated = getRotated({ field: getRotated({ field: lhs }) });

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

export const isRotation180 = createRelation({
  id,
  description,
  evaluate,
});
