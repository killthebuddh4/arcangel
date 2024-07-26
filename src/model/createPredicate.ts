import { Field } from "../field/Field.js";
import { Predicate } from "./Predicate.js";
import { Observation } from "./Observation.js";

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
