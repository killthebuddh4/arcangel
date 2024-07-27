import { getModel } from "./getModel.js";

export const getRelations = () => {
  const model = getModel();

  return model.relations;
};
