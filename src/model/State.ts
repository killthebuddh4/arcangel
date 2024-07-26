import { Field } from "../field/Field.js";
import { Transition } from "./Transition.js";
import { Observation } from "./Observation.js";
import { Predicate } from "./Predicate.js";

export type State = {
  id: string;
  field: Field;
  data: Array<{ predicate: Predicate; observation: Observation }>;
  upstream: Transition | null;
  downstream: Transition[];
};
