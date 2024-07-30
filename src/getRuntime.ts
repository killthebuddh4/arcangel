import { STORE } from "./store.js";

export const getRuntime = () => {
  if (STORE.runtime === null) {
    throw new Error("runtime is not defined");
  }

  return STORE.runtime;
};
