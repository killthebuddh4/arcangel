import { Transition } from "./Transition.js";
import { Operator } from "../operator/Operator.js";
import { State } from "./State.js";
import { Relation } from "../relation/Relation.js";
import { Observation } from "../observation/Observation.js";
import { v4 as uuidv4 } from "uuid";

export const createTransition = (args: {
  operator: Operator;
  upstream: State;
  downstream: State;
  data: Array<{ relation: Relation; observation: Observation }>;
}): Transition => {
  const transition = {
    id: uuidv4(),
    operator: args.operator,
    upstream: args.upstream,
    downstream: args.downstream,
    data: args.data,
  };

  args.upstream.downstream.push(transition);
  args.downstream.upstream = transition;

  return transition;
};
