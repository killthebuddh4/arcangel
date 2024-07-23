import { Canvas } from "../canvas/Canvas.js";
import { Edge } from "./Edge.js";

export type Node = {
  upstream: Edge | null;
  downstream: Edge[];
  canvas: Canvas;
};
