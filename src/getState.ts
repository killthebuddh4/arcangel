import { getRuntime } from "./getRuntime.js";

export const getState = (args: { stateId: string }) => {
  const runtime = getRuntime();

  const state = runtime.states.find((state) => {
    return state.id === args.stateId;
  });

  if (state === undefined) {
    throw new Error(`State not found: ${args.stateId}`);
  }

  return state;
};
