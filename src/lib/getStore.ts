import { Runtime } from "../types/Runtime.js";

const STORE: { runtime: Runtime | null } = {
  runtime: null,
};

export const getStore = () => {
  return STORE;
};
