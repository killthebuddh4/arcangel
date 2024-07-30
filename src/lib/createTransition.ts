import { Transition } from "../types/Transition.js";
import { Operator } from "../types/Operator.js";
import { State } from "../types/State.js";
import { Relation } from "../types/Relation.js";
import { Observation } from "../types/Observation.js";
import { Fault } from "../types/Fault.js";
import { v4 as uuidv4 } from "uuid";

export const createTransition = (args: {
  operator: Operator;
  upstream: State | Fault;
  downstream: State | Fault;
  data: Array<{ relation: Relation; observation: Observation }>;
}): Transition => {
  return {
    id: uuidv4(),
    operator: args.operator,
    upstream: args.upstream,
    downstream: args.downstream,
    data: args.data,
  };
};
