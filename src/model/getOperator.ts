import { getModel } from "./getModel.js";

export const getOperator = (args: { operatorId: string }) => {
  const model = getModel();

  return model.operators.find((operator) => {
    return operator.id === args.operatorId;
  });
};
