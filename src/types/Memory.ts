import { State } from "./State.js";
import { Transition } from "./Transition.js";
import { Fault } from "./Fault.js";

export type Memory = {
  id: string;
  states: State[];
  transitions: Transition[];
  faults: Fault[];
};
