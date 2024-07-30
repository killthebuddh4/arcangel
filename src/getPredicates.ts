import { getRuntime } from "./getRuntime.js";

export const getPredicates = () => {
  const runtime = getRuntime();

  return runtime.predicates;
};
