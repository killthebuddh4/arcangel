import { Field } from "../field/Field.js";
import { Observation } from "../observation/Observation.js";
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
