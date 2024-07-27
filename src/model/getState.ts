import { getModel } from "./getModel.js";

export const getState = (args: { stateId: string }) => {
  const model = getModel();

  const state = model.states.find((state) => {
    return state.id === args.stateId;
  });

  if (state === undefined) {
    throw new Error(`State not found: ${args.stateId}`);
  }

  return state;
};
