import { Point } from "./Point.js";
import { Canvas } from "./Canvas.js";

export const filterCanvas = (args: {
  canvas: Canvas;
  filter: (point: Point) => boolean;
}) => {
  args.canvas.points = args.canvas.points.filter(args.filter);
  return args.canvas;
};
