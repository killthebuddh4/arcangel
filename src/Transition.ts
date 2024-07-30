import { Operator } from "./Operator.js";
import { Observation } from "./Observation.js";
import { State } from "./State.js";
import { Fault } from "./Fault.js";
import { Relation } from "./Relation.js";

export type Transition = {
  id: string;
  operator: Operator;
  data: Array<{ relation: Relation; observation: Observation }>;
  upstream: State | Fault;
  downstream: State | Fault;
};
