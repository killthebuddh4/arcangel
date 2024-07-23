import { Canvas } from "./Canvas.js";

export const getPoint = (args: { x: number; y: number; canvas: Canvas }) => {
  return args.canvas.points.find(
    (point) => point.x === args.x && point.y === args.y,
  );
};
