import { createRelation } from "../model/createRelation.js";
import { Observation } from "../model/Observation.js";
import { Field } from "../field/Field.js";
import { rotate } from "../transforms/rotate.js";
import { compare } from "../field/compare.js";

const id = "isRotation";

const description = `The relation is satisfied if and only if the RHS field is a rotation of the LHS field.`;

const evaluate = (lhs: Field, rhs: Field): Observation => {
  const rotatedHeight = lhs.width;
  const rotatedWidth = lhs.height;

  const isSameDimensions =
    rotatedHeight === rhs.height && rotatedWidth === rhs.width;
  const isSwappedDimensions =
    lhs.height === rhs.width && lhs.width === rhs.height;

  if (!isSameDimensions && !isSwappedDimensions) {
    return {
      isPositive: false,
      notes: `A rotation will either have the same dimensions or the dimensions will be swapped. The LHS field has dimensions ${lhs.height}x${lhs.width}, the RHS field has dimensions ${rhs.height}x${rhs.width}.`,
    };
  }

  const isSameComparison = compare({ a: lhs, b: rhs });

  if (isSameComparison.result === "equal") {
    return {
      isPositive: true,
      notes: `The LHS field is the same as the RHS field, so it is a rotation of itself.`,
    };
  }

  const rotated90 = rotate({ field: lhs });
  const isRotate90Comparison = compare({ a: rotated90, b: rhs });

  if (isRotate90Comparison.result === "equal") {
    return {
      isPositive: true,
      notes: `The RHS field is a 90 degree rotation of the LHS field.`,
    };
  }

  const rotated180 = rotate({ field: rotated90 });
  const isRotate180Comparison = compare({ a: rotated180, b: rhs });

  if (isRotate180Comparison.result === "equal") {
    return {
      isPositive: true,
      notes: `The RHS field is a 180 degree rotation of the LHS field.`,
    };
  }

  const rotated270 = rotate({ field: rotated180 });
  const isRotate270Comparison = compare({ a: rotated270, b: rhs });

  if (isRotate270Comparison.result === "equal") {
    return {
      isPositive: true,
      notes: `The RHS field is a 270 degree rotation of the LHS field.`,
    };
  }

  const size = lhs.height * lhs.width;

  if (isSameDimensions) {
    if (isSwappedDimensions) {
      if (isSameComparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isSameComparison.result}.`,
        );
      }

      if (isRotate90Comparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isRotate90Comparison.result}.`,
        );
      }

      if (isRotate180Comparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isRotate180Comparison.result}.`,
        );
      }

      if (isRotate270Comparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isRotate270Comparison.result}.`,
        );
      }

      const percentMismatch = (isSameComparison.mismatches.length / size) * 100;
      const percent90Mismatch =
        (isRotate90Comparison.mismatches.length / size) * 100;
      const percent180Mismatch =
        (isRotate180Comparison.mismatches.length / size) * 100;
      const percent270Mismatch =
        (isRotate270Comparison.mismatches.length / size) * 100;

      return {
        isPositive: false,
        notes: `The LHS and RHS fields have the same dimensions, but the LHS field and RHS field have different points. The LHS field has ${percentMismatch}% of the points not matching, the 90 degree rotation has ${percent90Mismatch}% of the points not matching, the 180 degree rotation has ${percent180Mismatch}% of the points not matching, and the 270 degree rotation has ${percent270Mismatch}% of the points not matching.`,
      };
    } else {
      if (isSameComparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isSameComparison.result}.`,
        );
      }

      if (isRotate180Comparison.result !== "mismatch points") {
        throw new Error(
          `Expected a mismatch points result, but got ${isRotate180Comparison.result}.`,
        );
      }

      const percentMismatch = (isSameComparison.mismatches.length / size) * 100;
      const percent180Mismatch =
        (isRotate180Comparison.mismatches.length / size) * 100;

      return {
        isPositive: false,
        notes: `The LHS and RHS fields have the same dimensions, but the LHS field and RHS field have different points. The LHS field has ${percentMismatch}% of the points not matching, and the 180 degree rotation has ${percent180Mismatch}% of the points not matching.`,
      };
    }
  }

  if (isSwappedDimensions) {
    if (isRotate90Comparison.result !== "mismatch points") {
      throw new Error(
        `Expected a mismatch points result, but got ${isRotate90Comparison.result}.`,
      );
    }

    if (isRotate270Comparison.result !== "mismatch points") {
      throw new Error(
        `Expected a mismatch points result, but got ${isRotate270Comparison.result}.`,
      );
    }

    const percent90Mismatch =
      (isRotate90Comparison.mismatches.length / size) * 100;
    const percent270Mismatch =
      (isRotate270Comparison.mismatches.length / size) * 100;

    return {
      isPositive: false,
      notes: `The LHS and RHS fields have swapped dimensions, but the 90 degree rotation has ${percent90Mismatch}% of the points not matching and the 270 degree rotation has ${percent270Mismatch}% of the points not matching.`,
    };
  }

  throw new Error(`Unexpected state.`);
};

export const isRotation = createRelation({
  id,
  description,
  evaluate,
});
