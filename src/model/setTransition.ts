import { getModel } from "./getModel.js";
import { Transition } from "./Transition.js";

export const setTransition = (args: { transition: Transition }) => {
  const model = getModel();

  model.transitions.push(args.transition);
};
