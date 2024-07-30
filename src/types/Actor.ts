import { Runtime } from "./Runtime.js";
import { Operator } from "./Operator.js";
import { State } from "./State.js";
import { Fault } from "./Fault.js";

export type Actor = {
  select: (args: { runtime: Runtime }) => Operator;
  parameterize: (args: { runtime: Runtime }) => unknown;
  act: (args: {
    head: State;
    operator: Operator;
    args: unknown;
  }) => State | Fault;
};
