import { Model } from "./Model.js";
import { Operation } from "./Operation.js";
import { Predicate } from "./Predicate.js";
import { State } from "./State.js";

export const create = (args: {
  initial: State;
  operations: Operation[];
  predicates: Predicate[];
}): Model => {
  return {
    states: [args.initial],
    transitions: [],
    operations: args.operations,
    predicates: args.predicates,
  };
};
