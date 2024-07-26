import { Operator } from "../operator/Operator.js";
import { Observation } from "../observation/Observation.js";
import { State } from "./State.js";
import { Relation } from "../relation/Relation.js";

export type Transition = {
  operator: Operator;
  data: Array<{ relation: Relation; observation: Observation }>;
  upstream: State;
  downstream: State;
};
