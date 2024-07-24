import { getGraph } from "./getGraph.js";

export const getNode = (args: { id: string }) => {
  return getGraph().nodes.find((node) => node.id === args.id);
};
