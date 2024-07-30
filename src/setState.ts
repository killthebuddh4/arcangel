import { getRuntime } from "./getRuntime.js";
import { State } from "./State.js";

export const setState = (args: { state: State }) => {
  const runtime = getRuntime();

  runtime.states.push(args.state);
};
