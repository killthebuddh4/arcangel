import { Field } from "./Field.js";
import { Observation } from "./Observation.js";

export type Invariant = {
  id: string;
  description: string;
  evaluate: (fields: Field[]) => Observation;
};
