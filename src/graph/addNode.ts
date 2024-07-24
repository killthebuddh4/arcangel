import { Grid } from "../grid/Grid.js";
import { Edge } from "./Edge.js";
import { Node } from "./Node.js";
import { getGraph } from "./getGraph.js";
import { v4 as uuidv4 } from "uuid";

export const addNode = (args: {
  upstream: Node;
  operation: string;
  canvas: Grid;
}) => {
  const edge: Edge = {
    id: uuidv4(),
    operation: args.operation,
    upstream: args.upstream,
    downstream: null as unknown as Node,
  };

  const node: Node = {
    id: uuidv4(),
    upstream: edge,
    downstream: [],
    canvas: args.canvas,
  };

  edge.downstream = node;

  getGraph().edges.push(edge);
  getGraph().nodes.push(node);

  return node;
};
