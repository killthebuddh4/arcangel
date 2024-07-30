import { Runtime } from "./types/Runtime.js";

export const exec = (args: {
  runtime: Runtime;
  iterate: (args: { runtime: Runtime }) => void;
  isFaulty: (args: { runtime: Runtime }) => boolean;
  isFinished: (args: { runtime: Runtime }) => boolean;
  options?: { maxIterations?: number };
}) => {
  const maxIterations = (() => {
    if (args.options?.maxIterations === undefined) {
      return 100;
    }

    return args.options.maxIterations;
  })();

  const ITER_STATE = {
    iteration: 0,
  };

  while (
    !args.isFaulty({ runtime: args.runtime }) &&
    !args.isFinished({ runtime: args.runtime })
  ) {
    ITER_STATE.iteration += 1;

    if (ITER_STATE.iteration > maxIterations) {
      break;
    }

    args.iterate({ runtime: args.runtime });
  }

  return args.runtime;
};
