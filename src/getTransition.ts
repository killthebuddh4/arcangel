import { getRuntime } from "./getRuntime.js";

export const getTransition = (args: { transitionId: string }) => {
  const runtime = getRuntime();

  const transition = runtime.transitions.find((transition) => {
    return transition.id === args.transitionId;
  });

  if (transition === undefined) {
    throw new Error(`Transition not found: ${args.transitionId}`);
  }

  return transition;
};
