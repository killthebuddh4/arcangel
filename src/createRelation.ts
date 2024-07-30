import { Field } from "./types/Field.js";
import { Observation } from "./types/Observation.js";
import { Relation } from "./Relation.js";

export const createRelation = (args: {
  id: string;
  description: string;
  evaluate: (lhs: Field, rhs: Field) => Observation;
}): Relation => {
  return {
    id: args.id,
    description: args.description,
    evaluate: args.evaluate,
  };
};
