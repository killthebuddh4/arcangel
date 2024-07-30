import { createRelation } from "./createRelation.js";
import { Observation } from "./types/Observation.js";
import { Field } from "./types/Field.js";
import { diff } from "./diffFields.js";

const id = "isEqual";

const description = `The relation is satisfied if and only if the LHS and RHS fields have the exact same dimensions and points.`;

const evaluate = (lhs: Field, rhs: Field): Observation => {
  const isSameDimensions = lhs.height === rhs.height && lhs.width === rhs.width;

  if (!isSameDimensions) {
    return {
      isPositive: false,
      notes: `The LHS field has height: ${lhs.height}, width: ${lhs.width}, the RHS field has height: ${rhs.height}, width: ${rhs.width}.`,
    };
  }

  const isComparison = diff({ lhs: lhs, rhs: rhs });

  if (!(isComparison.result === "equal")) {
    const size = lhs.height * lhs.width;

    if (isComparison.result !== "mismatch points") {
      throw new Error(
        `Expected a mismatch points result, but got ${isComparison.result}.`,
      );
    }

    const percentMismatch = (isComparison.mismatches.length / size) * 100;

    return {
      isPositive: false,
      notes: `${percentMismatch}% of the points do not match.`,
    };
  }

  return {
    isPositive: true,
  };
};

export const isEqual = createRelation({
  id,
  description,
  evaluate,
});
