import { Predicate } from "./Predicate.js";
import { Relation } from "./Relation.js";
import { Invariant } from "./Invariant.js";
import { Operator } from "./Operator.js";

export type Runtime = {
  id: string;
  operators: Operator[];
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
};
