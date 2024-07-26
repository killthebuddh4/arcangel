import { State } from "./State.js";
import { Transition } from "./Transition.js";
import { Operator } from "../operator/Operator.js";
import { Predicate } from "../predicate/Predicate.js";
import { Relation } from "../relation/Relation.js";
import { Invariant } from "../invariant/Invariant.js";

export type Model = {
  states: State[];
  transitions: Transition[];
  operators: Operator[];
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
};
