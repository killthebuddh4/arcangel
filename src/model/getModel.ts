import { memory } from "./memory.js";

export const getModel = () => {
  if (memory.model === null) {
    throw new Error("model is not defined");
  }

  return memory.model;
};
