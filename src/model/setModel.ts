import { Model } from "./Model.js";
import { memory } from "./memory.js";

export const setModel = (args: { model: Model }) => {
  if (memory.model !== null) {
    throw new Error("model is already defined");
  }

  memory.model = args.model;
};
