import { Field } from "../field/Field.js";
import { Observation } from "./Observation.js";

export type Predicate = {
  id: string;
  description: string;
  evaluate: (field: Field) => Observation;
};
