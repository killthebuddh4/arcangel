import { Operation } from "./Operation.js";
import { State } from "./State.js";

export type Transition = {
  operation: Operation;
  upstream: State;
  downstream: State;
};
