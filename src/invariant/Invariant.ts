import { Field } from "../field/Field.js";
import { Observation } from "../observation/Observation.js";

export type Invariant = {
  id: string;
  description: string;
  evaluate: (fields: Field[]) => Observation;
};
