import { Runtime } from "./Runtime.js";
import { STORE } from "./store.js";

export const setRuntime = (args: { runtime: Runtime }) => {
  if (STORE.runtime !== null) {
    throw new Error("runtime is already defined");
  }

  STORE.runtime = args.runtime;
};
