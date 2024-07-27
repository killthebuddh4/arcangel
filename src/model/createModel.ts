import { Model } from "./Model.js";
import { Operator } from "../operator/Operator.js";
import { Predicate } from "../predicate/Predicate.js";
import { Relation } from "../relation/Relation.js";
import { Invariant } from "../invariant/Invariant.js";
import { Primitive } from "../primitive/Primitive.js";
import { State } from "./State.js";
import { v4 as uuidv4 } from "uuid";
import { setModel } from "./setModel.js";
import { getModel } from "./getModel.js";

export const createModel = (args: {
  initial: State;
  operators: Operator[];
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
  primitives: Primitive[];
}): Model => {
  setModel({
    model: {
      id: uuidv4(),
      states: [args.initial],
      transitions: [],
      operators: args.operators,
      predicates: args.predicates,
      relations: args.relations,
      invariants: args.invariants,
      primitives: args.primitives,
    },
  });

  return getModel();
};
