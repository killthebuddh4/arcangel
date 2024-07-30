import { Transition } from "./types/Transition.js";
import { v4 as uuidv4 } from "uuid";
import { Fault } from "./types/Fault.js";

export const createFault = (args: {
  code: string;
  upstream: Transition | null;
  downstream: Transition[];
}): Fault => {
  return {
    id: uuidv4(),
    type: "fault",
    code: args.code,
    upstream: args.upstream,
    downstream: args.downstream,
  };
};
