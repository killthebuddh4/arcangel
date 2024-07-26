import { createPredicate } from "../model/createPredicate.js";
import { Field } from "../field/Field.js";
import { Observation } from "../model/Observation.js";

const id = "isSquare";

const description =
  "The predicate is true if and only if the field is a square. That is, if both the width and the height are equal.";

const evaluate = (field: Field): Observation => {
  if (field.width !== field.height) {
    return {
      isPositive: false,
      notes: `The field is not a square because its width is ${field.width} and its height is ${field.height}.`,
    };
  }

  return {
    isPositive: true,
  };
};

export const isSquare = createPredicate({ id, description, evaluate });
