import { getModel } from "./getModel.js";

export const getPredicates = () => {
  const model = getModel();

  return model.predicates;
};
