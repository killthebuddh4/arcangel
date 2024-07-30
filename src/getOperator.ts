import { getRuntime } from "./getRuntime.js";

export const getOperator = (args: { operatorId: string }) => {
  const runtime = getRuntime();

  return runtime.operators.find((operator) => {
    return operator.id === args.operatorId;
  });
};
