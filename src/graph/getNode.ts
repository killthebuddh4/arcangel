import { Canvas } from "../canvas/Canvas.js";
import { getGraph } from "./getGraph.js";

export const getNode = (args: { canvas: Canvas }) => {
  const graph = getGraph();
  const node = graph.nodes.find((node) => node.canvas.id === args.canvas.id);

  if (node === undefined) {
    throw new Error(`Node not found for canvas id ${args.canvas.id}`);
  }

  return node;
};
