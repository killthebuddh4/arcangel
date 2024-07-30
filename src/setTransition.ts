import { getRuntime } from "./getRuntime.js";
import { Transition } from "./Transition.js";

export const setTransition = (args: { transition: Transition }) => {
  const runtime = getRuntime();

  runtime.transitions.push(args.transition);
};
