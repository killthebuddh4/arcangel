import { Runtime } from "../types/Runtime.js";
import { Transformation } from "../types/Transformation.js";
import { Predicate } from "../types/Predicate.js";
import { Relation } from "../types/Relation.js";
import { Invariant } from "../types/Invariant.js";
import { Operator } from "../types/Operator.js";
import { v4 as uuidv4 } from "uuid";
import { Field } from "../types/Field.js";

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
