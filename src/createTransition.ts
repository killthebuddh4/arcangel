import { Transition } from "./Transition.js";
import { Operator } from "./Operator.js";
import { State } from "./State.js";
import { Relation } from "./Relation.js";
import { Observation } from "./Observation.js";
import { v4 as uuidv4 } from "uuid";
import { Fault } from "./Fault.js";

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
