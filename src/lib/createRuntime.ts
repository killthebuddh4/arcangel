import { Maybe } from "../types/Maybe.js";
import { createMaybe } from "./createMaybe.js";
import { v4 as uuidv4 } from "uuid";
import { Operator } from "../types/Operator.js";
import { Predicate } from "../types/Predicate.js";
import { Relation } from "../types/Relation.js";
import { Invariant } from "../types/Invariant.js";
import { Runtime } from "../types/Runtime.js";

export const createRuntime = (args: {
  operators: Operator[];
  predicates: Predicate[];
  relations: Relation[];
  invariants: Invariant[];
}): Maybe<Runtime> => {
  return createMaybe({
    ok: true,
    data: {
      id: uuidv4(),
      operators: args.operators,
      predicates: args.predicates,
      relations: args.relations,
      invariants: args.invariants,
    },
  });
};
