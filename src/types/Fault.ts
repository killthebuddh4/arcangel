import { Transition } from "./Transition.js";

export type Fault = {
  id: string;
  type: "fault";
  code: string;
  upstream: Transition | null;
  downstream: Transition[];
};
