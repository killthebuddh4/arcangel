import { getRuntime } from "./getRuntime.js";

export const getRelations = () => {
  const runtime = getRuntime();

  return runtime.relations;
};
