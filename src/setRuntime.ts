import { Runtime } from "./types/Runtime.js";
import { STORE } from "./getStore.js";

export const setRuntime = (args: { runtime: Runtime }) => {
  if (STORE.runtime !== null) {
    throw new Error("runtime is already defined");
  }

  STORE.runtime = args.runtime;
};
