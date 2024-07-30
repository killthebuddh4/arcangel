import { Runtime } from "./Runtime.js";
import { Transformation } from "./Transformation.js";
import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";
import { Invariant } from "./Invariant.js";
import { Operator } from "./Operator.js";
import { v4 as uuidv4 } from "uuid";
import { Field } from "./Field.js";

export const createRuntime = (args: {
  input: Field;
  transformation: Transformation;
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
  primitives: Operator[];
}): Runtime => {
  return {
    id: uuidv4(),
    input: args.input,
    transformation: args.transformation,
    states: [],
    transitions: [],
    faults: [],
    operators: args.primitives,
    predicates: args.predicates,
    relations: args.relations,
    invariants: args.invariants,
  };
};
