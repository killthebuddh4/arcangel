import { getModel } from "./getModel.js";
import { State } from "./State.js";

export const setState = (args: { state: State }) => {
  const model = getModel();

  model.states.push(args.state);
};
