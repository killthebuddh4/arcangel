import { Field } from "../types/Field.js";
import { Observation } from "../types/Observation.js";
import { Invariant } from "../types/Invariant.js";

export const createInvariant = (args: {
  id: string;
  description: string;
  evaluate: (fields: Field[]) => Observation;
}): Invariant => {
  return {
    id: args.id,
    description: args.description,
    evaluate: args.evaluate,
  };
};
