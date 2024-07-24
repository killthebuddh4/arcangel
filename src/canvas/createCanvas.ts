import { v4 as uuidv4 } from "uuid";
import { Canvas } from "./Canvas.js";
import { Point } from "./Point.js";

export const createCanvas = (args: { points?: Point[] }): Canvas => {
  return {
    id: uuidv4(),
    points: args.points ?? [],
  };
};
