import { Model } from "./Model.js";
import { Operation } from "./Operation.js";
import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";
import { State } from "./State.js";

export const createModel = (args: {
  initial: State;
  operations: Operation[];
  predicates: Predicate[];
  relations: Relation[];
}): Model => {
  return {
    states: [args.initial],
    transitions: [],
    operations: args.operations,
    predicates: args.predicates,
    relations: args.relations,
  };
};
