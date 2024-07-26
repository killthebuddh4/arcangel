import { Operation } from "./Operation.js";
import { Observation } from "./Observation.js";
import { State } from "./State.js";
import { Relation } from "./Relation.js";

export type Transition = {
  operation: Operation;
  data: Array<{ relation: Relation; observation: Observation }>;
  upstream: State;
  downstream: State;
};
