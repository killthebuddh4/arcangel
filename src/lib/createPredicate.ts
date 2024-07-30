import { Field } from "../types/Field.js";
import { Predicate } from "../types/Predicate.js";
import { Observation } from "../types/Observation.js";

export const createPredicate = (args: {
  id: string;
  description: string;
  evaluate: (field: Field) => Observation;
}): Predicate => {
  return {
    id: args.id,
    description: args.description,
    evaluate: args.evaluate,
  };
};
