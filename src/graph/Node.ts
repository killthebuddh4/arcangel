import { Grid } from "../grid/Grid.js";
import { Edge } from "./Edge.js";

export type Node = {
  id: string;
  upstream: Edge | null;
  downstream: Edge[];
  canvas: Grid;
};
