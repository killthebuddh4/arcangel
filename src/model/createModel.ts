import { Model } from "./Model.js";
import { Operator } from "../operator/Operator.js";
import { Predicate } from "../predicate/Predicate.js";
import { Relation } from "../relation/Relation.js";
import { Invariant } from "../invariant/Invariant.js";
import { State } from "./State.js";

export const createModel = (args: {
  initial: State;
  operators: Operator[];
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
}): Model => {
  return {
    states: [args.initial],
    transitions: [],
    operators: args.operators,
    predicates: args.predicates,
    relations: args.relations,
    invariants: args.invariants,
  };
};
