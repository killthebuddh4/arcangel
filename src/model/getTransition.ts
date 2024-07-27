import { getModel } from "./getModel.js";

export const getTransition = (args: { transitionId: string }) => {
  const model = getModel();

  const transition = model.transitions.find((transition) => {
    return transition.id === args.transitionId;
  });

  if (transition === undefined) {
    throw new Error(`Transition not found: ${args.transitionId}`);
  }

  return transition;
};
