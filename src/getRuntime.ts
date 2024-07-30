import { getStore } from "./getStore.js";

export const getRuntime = () => {
  return getStore().runtime;
};
