import { Field } from "./Field.js";
import { Observation } from "./Observation.js";
import { Invariant } from "./Invariant.js";

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
