import { Field } from "../field/Field.js";
import { Observation } from "./Observation.js";

export type Relation = {
  id: string;
  description: string;
  evaluate: (lhs: Field, rhs: Field) => Observation;
};
