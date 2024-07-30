import { getRuntime } from "./getRuntime.js";
import { Fault } from "./Fault.js";

export const setFault = (args: { fault: Fault }) => {
  const runtime = getRuntime();

  runtime.faults.push(args.fault);
};
