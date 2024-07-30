import { getRuntime } from "./getRuntime.js";

export const getHeads = () => {
  const runtime = getRuntime();

  return runtime.states.filter((state) => {
    return runtime.transitions.every((transition) => {
      return transition.upstream.id !== state.id;
    });
  });
};
