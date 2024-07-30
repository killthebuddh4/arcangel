import { State } from "./State.js";
import { Transition } from "./Transition.js";
import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";
import { Invariant } from "./Invariant.js";
import { Operator } from "./Operator.js";
import { Transformation } from "./Transformation.js";
import { Field } from "./Field.js";
import { Fault } from "./Fault.js";

export type Runtime = {
  id: string;

  // motivation (or something)
  input: Field;
  transformation: Transformation;

  // memory
  states: State[];
  transitions: Transition[];
  faults: Fault[];

  // system calls
  operators: Operator[];

  // grounding (or something)
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
};
