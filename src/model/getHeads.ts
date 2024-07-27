import { getModel } from "./getModel.js";

export const getHeads = () => {
  const model = getModel();

  return model.states.filter((state) => {
    return model.transitions.every((transition) => {
      return transition.upstream.id !== state.id;
    });
  });
};
