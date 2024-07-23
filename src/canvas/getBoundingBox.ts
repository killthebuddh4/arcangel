import { Canvas } from "./Canvas.js";

export const getBoundingBox = (args: { canvas: Canvas }) => {
  const minX = Math.min(...args.canvas.points.map((point) => point.x));
  const maxX = Math.max(...args.canvas.points.map((point) => point.x));
  const minY = Math.min(...args.canvas.points.map((point) => point.y));
  const maxY = Math.max(...args.canvas.points.map((point) => point.y));

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
};
