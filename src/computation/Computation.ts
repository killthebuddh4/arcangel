import { State } from "../model/State.js";
import { Predicate } from "../predicate/Predicate.js";
import { Observation } from "../observation/Observation.js";

export type Computation = {
  id: string;
  description: string;
  interface: {
    upstream: Array<{ predicate: Predicate; observation: Observation }>;
    downstream: Array<{ predicate: Predicate; observation: Observation }>;
    // TODO Do I need predicates fo the relationship of inputs to output?
  };
  // NOTE I think these must always be leaf states when the output is undefined?
  inputs: State[];
  output?: State;
};
