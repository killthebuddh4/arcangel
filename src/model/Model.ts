import { State } from "./State.js";
import { Transition } from "./Transition.js";
import { Operation } from "./Operation.js";
import { Predicate } from "./Predicate.js";

export type Model = {
  states: State[];
  transitions: Transition[];
  operations: Operation[];
  predicates: Predicate[];
};
